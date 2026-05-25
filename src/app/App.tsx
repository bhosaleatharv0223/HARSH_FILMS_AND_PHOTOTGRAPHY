import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Camera, Phone, Instagram, Mail, MapPin, ChevronDown, Check, X, Menu, ZoomIn, CheckCircle, Printer, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import phonepeQR from '../imports/WhatsApp_Image_2026-05-22_at_10.00.08_PM.jpeg';
import instagramQR from '../imports/WhatsApp_Image_2026-05-22_at_10.00.07_PM.jpeg';

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [eventDurations, setEventDurations] = useState<Map<string, 'full' | 'half'>>(new Map());
  const [albumType, setAlbumType] = useState<'small' | 'large'>('small');
  const [albumPages, setAlbumPages] = useState(20);
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [customerName, setCustomerName] = useState('');
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [expandedAbout, setExpandedAbout] = useState<number | null>(null);
  const [qrZoom, setQrZoom] = useState<'phonepe' | 'instagram' | null>(null);
  const [billPreview, setBillPreview] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [billImageBase64, setBillImageBase64] = useState<string | null>(null);

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadStep, setUploadStep] = useState('');
  const [uploadError, setUploadError] = useState('');
  const billRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    eventType: '',
    eventDate: '',
    location: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Splash screen effect
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animations for accessibility
      setTimeout(() => {
        setSplashVisible(false);
        setSiteLoaded(true);
        document.body.style.overflow = 'auto';
      }, 500);
    } else {
      // Normal cinematic sequence
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        setSplashVisible(false);
        setSiteLoaded(true);
        document.body.style.overflow = 'auto';
      }, 3000);
    }
  }, []);

  // Portfolio images data
  const portfolioImages = [
    { src: portfolio1, alt: 'Cinematic Wedding Photography', caption: 'Timeless Wedding Moments' },
    { src: portfolio2, alt: 'Pre-Wedding Shoot', caption: 'Love Story Captured' },
    { src: portfolio3, alt: 'Engagement Photography', caption: 'Celebration of Love' },
    { src: portfolio4, alt: 'Traditional Wedding', caption: 'Cultural Heritage' },
    { src: portfolio5, alt: 'Couple Portrait', caption: 'Intimate Moments' },
    { src: portfolio6, alt: 'Destination Wedding', caption: 'Scenic Celebrations' },
    { src: portfolio7, alt: 'Candid Photography', caption: 'Natural Emotions' },
    { src: portfolio8, alt: 'Cinematic Videography', caption: 'Stories in Motion' }
  ];

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % portfolioImages.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + portfolioImages.length) % portfolioImages.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Touch swipe support for mobile
  useEffect(() => {
    if (!lightboxOpen) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const deltaX = touchEndX - touchStartX;
      
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          prevPhoto();
        } else {
          nextPhoto();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [lightboxOpen]);

  const eventCategories = {
    priority: [
      { id: 'wedding', name: 'Wedding Photography', price: 25000 },
      { id: 'prewedding', name: 'Pre-Wedding Shoot', price: 18000 },
      { id: 'engagement', name: 'Engagement Shoot', price: 15000 },
      { id: 'haldi', name: 'Haldi/Mehendi', price: 12000 },
      { id: 'destination', name: 'Destination Wedding', price: 50000 }
    ],
    other: [
      { id: 'couple', name: 'Couple', price: 8000 },
      { id: 'fashion', name: 'Fashion', price: 10000 },
      { id: 'cinematic', name: 'Cinematic', price: 15000 },
      { id: 'nature', name: 'Nature & Travel', price: 12000 },
      { id: 'studio', name: 'Studio', price: 7000 },
      { id: 'social', name: 'Social Media', price: 6000 },
      { id: 'traditional', name: 'Traditional & Cultural', price: 9000 },
      { id: 'adventure', name: 'Adventure', price: 11000 },
      { id: 'beach', name: 'Beach', price: 10000 },
      { id: 'fort', name: 'Fort & Heritage', price: 12000 }
    ]
  };

  const addonServices = [
    { id: 'trad-photo', name: 'Traditional Photographer', price: 6000 },
    { id: 'candid-photo', name: 'Candid Photographer', price: 8000 },
    { id: 'trad-video', name: 'Traditional Videographer', price: 5000 },
    { id: 'cine-shoot', name: 'Cinematic Shoot', price: 10000 },
    { id: 'drone', name: 'Drone Shoot', price: 8000 },
    { id: 'screen', name: 'Screen', price: 12000 },
    { id: 'album-100', name: 'Album 100 Photos', price: 10000 },
    { id: 'trad-edit', name: 'Traditional Video Edit', price: 2000 },
    { id: 'cine-ht', name: 'Cinematic Shoot H+T', price: 6000 }
  ];

  const aboutDetails = [
    {
      icon: '📷',
      title: 'Our Approach',
      desc: 'Blend of artistry and technical excellence',
      fullContent: 'We combine artistic vision with cutting-edge technology to capture authentic moments. Our approach focuses on understanding your story and creating a visual narrative that reflects your unique personality and emotions.'
    },
    {
      icon: '👁️',
      title: 'Our Vision',
      desc: 'Creating visual narratives that resonate',
      fullContent: 'Our vision is to transform photography from mere documentation to meaningful storytelling. We believe every frame should evoke emotion and preserve the essence of the moment for generations to come.'
    },
    {
      icon: '✅',
      title: 'Quality Promise',
      desc: 'Premium service and exceptional results',
      fullContent: 'We are committed to delivering excellence in every aspect of our service. From planning to final delivery, we ensure premium quality, timely communication, and results that exceed expectations.'
    }
  ];

  const terms = [
    {
      title: 'Booking Confirmation',
      content: 'Advance payment is non-refundable and confirms your booking.'
    },
    {
      title: 'Payment',
      content: 'Balance amount must be paid on the day of the shoot.'
    },
    {
      title: 'Timing',
      content: 'Delays may reduce shoot duration or attract additional charges.'
    },
    {
      title: 'Cancellation',
      content: '7 days notice required for cancellation or rescheduling.'
    },
    {
      title: 'Travel & Permissions',
      content: 'Client bears entry fees and travel costs outside Pune.'
    },
    {
      title: 'Editing & Delivery',
      content: 'RAW files are not shared. Edited photos delivered within 30 days.'
    },
    {
      title: 'Copyright',
      content: 'Photographer retains rights to use photos for portfolio and marketing.'
    },
    {
      title: 'Liability',
      content: 'Not responsible for weather conditions or venue restrictions.'
    },
    {
      title: 'Client Responsibility',
      content: 'Outfits, props, and makeup to be arranged by client.'
    },
    {
      title: 'Agreement',
      content: 'Booking implies acceptance of all terms and conditions.'
    }
  ];

  const calculateTotal = () => {
    let total = 0;

    // Events
    selectedEvents.forEach(eventId => {
      const event = [...eventCategories.priority, ...eventCategories.other].find(e => e.id === eventId);
      if (event) {
        const duration = eventDurations.get(eventId) || 'full';
        total += duration === 'full' ? event.price : event.price * 0.6;
      }
    });

    // Album
    const albumPricePerPage = albumType === 'small' ? 70 : 100;
    const albumCover = albumType === 'small' ? 500 : 700;
    total += (albumPages * albumPricePerPage) + albumCover;

    // Addons
    addons.forEach(addonId => {
      const addon = addonServices.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });

    return total;
  };

  const scrollToSection = (id: string) => {
    setPortfolioOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const validateForm = () => {
    const errors = new Set<string>();
    if (!formData.fullName.trim()) errors.add('fullName');
    if (!formData.phone.trim()) errors.add('phone');
    if (!formData.eventType) errors.add('eventType');
    if (!formData.eventDate) errors.add('eventDate');
    if (!formData.location.trim()) errors.add('location');
    return errors;
  };

  const handleBooking = () => {
    const errors = validateForm();
    if (errors.size > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }
    setFormErrors(new Set());

    // Get selected services for the message
    const selectedServicesList = [];

    // Add selected events
    selectedEvents.forEach(eventId => {
      const event = [...eventCategories.priority, ...eventCategories.other].find(e => e.id === eventId);
      if (event) {
        const duration = eventDurations.get(eventId) || 'full';
        selectedServicesList.push(`${event.name} (${duration === 'full' ? 'Full Day' : 'Half Day'})`);
      }
    });

    // Add selected addons
    addons.forEach(addonId => {
      const addon = addonServices.find(a => a.id === addonId);
      if (addon) {
        selectedServicesList.push(addon.name);
      }
    });

    // Add album selection
    selectedServicesList.push(`${albumType === 'small' ? '8×24 Small' : '12×36 Large'} Album (${albumPages} pages)`);

    // Format the WhatsApp message with all form data
    const message = `🎬 *NEW BOOKING REQUEST*
━━━━━━━━━━━━━━━━━━━━
📋 *HARSH PHALKE FILMS & PHOTOGRAPHY*

👤 *Client Name:* ${formData.fullName}
📱 *Phone Number:* ${formData.phone}
🎉 *Event Type:* ${formData.eventType}
📅 *Event Date:* ${formData.eventDate}
📍 *Location / Venue:* ${formData.location}
💰 *Total Amount:* ₹${calculateTotal().toLocaleString()}

📋 *Selected Services:*
${selectedServicesList.map(service => `• ${service}`).join('\n')}

📝 *Special Notes:* ${formData.message || 'None'}

━━━━━━━━━━━━━━━━━━━━
✅ *Please confirm my booking!*`.trim();

    // Encode for URL
    const encodedMessage = encodeURIComponent(message);

    // Harsh's WhatsApp number
    const whatsappNumber = "917720049725"; // 91 + number (no spaces/dashes)

    // Open WhatsApp with pre-filled message
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    setBookingSuccess(true);
    toast.success('Booking request sent to WhatsApp!');
  };

  const generateBill = () => {
    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    // Generate invoice number if not already generated
    if (!invoiceNumber) {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 900) + 100; // 3 digit random number
      setInvoiceNumber(`HP-${year}-${randomNum}`);
    }

    setBillPreview(true);
    toast.success('Bill generated successfully');
  };

  const handleDownloadPDF = async () => {
    try {
      const billElement = billRef.current;
      if (!billElement) {
        alert('Bill not found. Please generate bill first.');
        return;
      }

      setIsGeneratingPDF(true);
      toast.info('Generating PDF...');

      const canvas = await html2canvas(billElement, {
        scale: 2,
        backgroundColor: '#0F0F0F',
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Also save to state for WhatsApp upload
      setBillImageBase64(imgData);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      pdf.addImage(imgData, 'JPEG', imgX, 0, imgWidth * ratio, imgHeight * ratio);

      const clientName = customerName?.replace(/\s+/g, '_') || 'Client';
      const today = new Date();
      const dateStr = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
      
      pdf.save(`HarshPhalke_Invoice_${clientName}_${dateStr}.pdf`);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('PDF generation failed. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    if (!billPreview) {
      toast.error('Please generate bill first');
      return;
    }

    // Try to print the page
    if (window.print) {
      window.print();
    } else {
      // Fallback to PDF download if print is not available
      handleDownloadPDF();
    }
  };



  const validateBookingForm = () => {
    const errors = new Set<string>();
    if (!formData.fullName.trim()) errors.add('fullName');
    if (!formData.phone.trim() || formData.phone.length < 10) errors.add('phone');
    if (!formData.eventType) errors.add('eventType');
    if (!formData.eventDate) errors.add('eventDate');
    if (!formData.location.trim()) errors.add('location');

    // Validate future date
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate <= today) {
        errors.add('eventDate');
      }
    }

    return errors;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!formData.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone?.trim() || formData.phone.length < 10)
      errors.phone = 'Valid 10-digit phone required';
    if (!formData.eventType)
      errors.eventType = 'Please select event type';
    if (!formData.eventDate)
      errors.eventDate = 'Event date is required';
    if (!formData.location?.trim())
      errors.location = 'Venue is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    setSubmitStatus('uploading');

    try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const dateStr = `${day}${month}${year}`;
      const clientName = formData.fullName.trim().replace(/\s+/g, '_');
      const refNumber = Math.floor(Math.random() * 900) + 100;

      // UPLOAD BILL
      let billUrl = 'Bill not generated';
      if (billImageBase64) {
        setUploadStep('📄 Uploading invoice... please wait');
        billUrl = await uploadToCloudinary(
          billImageBase64,
          `Bill_${clientName}_${dateStr}.jpg`
        );
      }

      setUploadStep('📲 Opening WhatsApp...');

      setUploadStep('📲 Opening WhatsApp...');

      const bookingDate = today.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const whatsappMessage = `🎬 *HARSH PHALKE FILMS & PHOTOGRAPHY*
✨ _Premium Photography & Cinematography_
📍 _Pune, Maharashtra_

━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 *NEW BOOKING REQUEST*
🗓️ _Date: ${bookingDate}_
🆔 _Ref: HP-${year}-${refNumber}_

━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *CLIENT DETAILS*
🙍 *Name*    →  ${formData.fullName}
� *CPhone*   →  +91 ${formData.phone}
🎊 *Event*   →  ${formData.eventType}
� **Date*    →  ${formData.eventDate}
📍 *Venue*   →  ${formData.location}
�  *Amount*  →  ₹${calculateTotal().toLocaleString()}
� *Notees*   →  ${formData.message?.trim() || 'No special requests'}

━━━━━━━━━━━━━━━━━━━━━━━━━
📎 *ATTACHMENTS*
🧾 *Invoice:*
${billUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━
✅ *ACTION REQUIRED*
1️⃣  Review booking details
2️⃣  Reply to client to confirm booking

━━━━━━━━━━━━━━━━━━━━━━━━━
💼 _Harsh Phalke Films & Photography_
🌐 _harshphalkefilms.com_
⚡ _Automated Booking System_`;

      const encoded = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/917720049725?text=${encoded}`, '_blank');

      setSubmitStatus('success');
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitStatus('error');
      setUploadError(error instanceof Error
        ? `Upload failed: ${error.message}`
        : 'Upload failed. Check internet and try again.');
    } finally {
      setIsSubmitting(false);
      setUploadStep('');
    }
  };

  const resetBookingForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      eventType: '',
      eventDate: '',
      location: '',
      message: ''
    });
    setFormErrors({});
    setBillImageBase64(null);
    setBookingSuccess(false);
    scrollToSection('services');
  };

  // Modal scroll behavior effects
  useEffect(() => {
    if (billPreview && modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [billPreview]);

  useEffect(() => {
    if (billPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [billPreview]);



  return (
    <>
      {/* Cinematic Splash Screen */}
      {splashVisible && (
        <div id="splash-screen" className="splash-screen">
          {/* Vignette Overlay */}
          <div className="splash-vignette" />
          
          {/* Filmstrip Bars */}
          <div className="filmstrip-bar filmstrip-top" />
          <div className="filmstrip-bar filmstrip-bottom" />
          
          {/* Floating Dust Particles */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="dust-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 2}px`,
                height: `${2 + Math.random() * 2}px`,
                opacity: 0.25 + Math.random() * 0.3,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
          
          {/* Logo Container with Shimmer */}
          <div className="splash-logo-wrapper">
            <div className="splash-shimmer" />
            <img 
              src={logo} 
              alt="Harsh Phalke Photography" 
              className="splash-logo"
            />
          </div>
          
          {/* Tagline */}
          <div className="splash-tagline">
            Stories Today. Memories Forever.
          </div>
        </div>
      )}

      <div className={`min-h-screen bg-[#0A0A0A] text-[#F5F0E8] ${siteLoaded ? 'site-loaded' : ''}`} style={{ fontFamily: 'var(--font-body)' }}>
      <Toaster position="top-center" theme="dark" toastOptions={{ style: { background: '#1E1E1E', color: '#F5F0E8', border: '1px solid #C9A84C' } }} />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#C9A84C]/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo} 
              alt="Harsh Phalke Photography Logo" 
              className="h-20 md:h-24 w-auto object-contain"
            />
          </button>
          <div className="hidden md:flex gap-8 text-sm">
            {['Home', 'About', 'Services', 'Contact'].map(item => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-[#C9A84C] transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => setPortfolioOpen(true)}
              className="hover:text-[#C9A84C] transition-colors"
            >
              Portfolio
            </button>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-[#C9A84C]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        id="home"
        style={{ opacity: heroOpacity }}
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 text-center px-6"
        >
          <h1
            className="text-5xl md:text-7xl mb-6 italic"
            style={{ fontFamily: 'var(--font-display)', color: '#F5F0E8' }}
          >
            Stories Today. Memories Forever.
          </h1>
          <p className="text-lg md:text-xl text-[#CCCCCC] mb-12">
            Cinematic Photography & Videography — Pune, Maharashtra
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('booking')}
              className="px-8 py-4 bg-[#C9A84C] text-[#0A0A0A] rounded-full font-medium"
            >
              Book Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('services')}
              className="px-8 py-4 border-2 border-[#C9A84C] text-[#C9A84C] rounded-full font-medium"
            >
              Explore Services
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-[#C9A84C]" />
        </motion.div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-4xl md:text-5xl mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              About Us
              <div className="h-1 w-24 bg-[#C9A84C] mt-3" />
            </h2>
            <p className="text-[#CCCCCC] text-lg leading-relaxed mb-12 max-w-3xl">
              We are a premium photography and videography studio based in Pune, specializing in
              cinematic storytelling that captures the essence of your most precious moments. With a
              passion for detail and emotion, we transform fleeting moments into timeless memories.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {aboutDetails.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setExpandedAbout(i)}
                className="bg-[#1E1E1E] p-8 rounded-lg text-center cursor-pointer hover:bg-[#1E1E1E]/80 transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-[#C9A84C]">{item.title}</h3>
                <p className="text-[#888888]">{item.desc}</p>
                <p className="text-xs text-[#C9A84C] mt-4">Click to learn more</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#1E1E1E]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl md:text-5xl mb-12 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Our Services
            </h2>
          </motion.div>

          {/* Event Selector */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-[#C9A84C]">Select Your Event</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {eventCategories.priority.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    const newSelected = new Set(selectedEvents);
                    if (newSelected.has(event.id)) {
                      newSelected.delete(event.id);
                    } else {
                      newSelected.add(event.id);
                    }
                    setSelectedEvents(newSelected);
                  }}
                  className={`bg-[#1E1E1E] p-6 rounded-lg cursor-pointer border-2 transition-all ${selectedEvents.has(event.id) ? 'border-[#C9A84C] shadow-lg shadow-[#C9A84C]/20' : 'border-transparent'
                    }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-2xl">💍</div>
                    {selectedEvents.has(event.id) && <Check className="w-5 h-5 text-[#C9A84C]" />}
                  </div>
                  <h4 className="font-bold mb-2 text-[#F5F0E8]">{event.name}</h4>
                  {selectedEvents.has(event.id) && (
                    <span className="added-badge">Added to Bill</span>
                  )}
                  {selectedEvents.has(event.id) && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newDurations = new Map(eventDurations);
                          newDurations.set(event.id, 'full');
                          setEventDurations(newDurations);
                        }}
                        className={`flex-1 py-1 px-2 text-xs rounded ${(eventDurations.get(event.id) || 'full') === 'full'
                          ? 'bg-[#C9A84C] text-[#0A0A0A]'
                          : 'bg-[#0A0A0A] text-[#888888]'
                          }`}
                      >
                        Full Day
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newDurations = new Map(eventDurations);
                          newDurations.set(event.id, 'half');
                          setEventDurations(newDurations);
                        }}
                        className={`flex-1 py-1 px-2 text-xs rounded ${eventDurations.get(event.id) === 'half'
                          ? 'bg-[#C9A84C] text-[#0A0A0A]'
                          : 'bg-[#0A0A0A] text-[#888888]'
                          }`}
                      >
                        Half Day
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {eventCategories.other.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    const newSelected = new Set(selectedEvents);
                    if (newSelected.has(event.id)) {
                      newSelected.delete(event.id);
                    } else {
                      newSelected.add(event.id);
                    }
                    setSelectedEvents(newSelected);
                  }}
                  className={`bg-[#1E1E1E] p-4 rounded-lg cursor-pointer border-2 transition-all ${selectedEvents.has(event.id) ? 'border-[#C9A84C]' : 'border-transparent'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xl">📸</div>
                    {selectedEvents.has(event.id) && <Check className="w-4 h-4 text-[#C9A84C]" />}
                  </div>
                  <h4 className="text-sm font-bold mb-1 text-[#F5F0E8]">{event.name}</h4>
                  {selectedEvents.has(event.id) && (
                    <span className="added-badge">Added to Bill</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Album Packages */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-[#C9A84C]">Album Packages</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setAlbumType('small')}
                className={`bg-[#1E1E1E] p-8 rounded-lg cursor-pointer border-2 ${albumType === 'small' ? 'border-[#C9A84C]' : 'border-transparent'
                  }`}
              >
                <h4 className="text-2xl font-bold mb-3">8×24 Small Album</h4>
                {albumType === 'small' && (
                  <span className="added-badge">Selected</span>
                )}
                {albumType === 'small' && <Check className="w-6 h-6 text-[#C9A84C] mt-2" />}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setAlbumType('large')}
                className={`bg-[#1E1E1E] p-8 rounded-lg cursor-pointer border-2 ${albumType === 'large' ? 'border-[#C9A84C]' : 'border-transparent'
                  }`}
              >
                <h4 className="text-2xl font-bold mb-3">12×36 Large Album</h4>
                {albumType === 'large' && (
                  <span className="added-badge">Selected</span>
                )}
                {albumType === 'large' && <Check className="w-6 h-6 text-[#C9A84C] mt-2" />}
              </motion.div>
            </div>
            <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md">
              <label className="block mb-3 text-[#CCCCCC]">Number of Pages</label>
              <input
                type="number"
                min="10"
                max="100"
                value={albumPages}
                onChange={(e) => setAlbumPages(Number(e.target.value))}
                className="w-full bg-[#0A0A0A] border-2 border-[#C9A84C]/30 focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Add-on Services */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-[#C9A84C]">Add-on Services</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {addonServices.map((addon) => (
                <motion.div
                  key={addon.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    const newAddons = new Set(addons);
                    if (newAddons.has(addon.id)) {
                      newAddons.delete(addon.id);
                    } else {
                      newAddons.add(addon.id);
                    }
                    setAddons(newAddons);
                  }}
                  className={`bg-[#1E1E1E] p-6 rounded-lg cursor-pointer border-2 transition-all ${addons.has(addon.id) ? 'border-[#C9A84C] shadow-lg shadow-[#C9A84C]/20' : 'border-transparent'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold mb-2 text-[#F5F0E8]">{addon.name}</h4>
                      {addons.has(addon.id) && (
                        <span className="added-badge">Added to Bill</span>
                      )}
                    </div>
                    {addons.has(addon.id) ? (
                      <Check className="w-6 h-6 text-[#C9A84C]" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-[#888888] rounded" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bill Generator */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1E1E1E] p-8 rounded-lg"
          >
            <h2
              className="text-3xl mb-6 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your Bill Summary
            </h2>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#0A0A0A] border-2 border-[#C9A84C]/30 focus:border-[#C9A84C] rounded-lg px-4 py-3 mb-6 outline-none transition-colors"
            />

            <div className="space-y-3 mb-6">
              {selectedEvents.size > 0 && (
                <>
                  <h3 className="text-[#C9A84C] font-bold mb-2">Events:</h3>
                  {Array.from(selectedEvents).map(eventId => {
                    const event = [...eventCategories.priority, ...eventCategories.other].find(e => e.id === eventId);
                    if (!event) return null;
                    const duration = eventDurations.get(eventId) || 'full';
                    const price = duration === 'full' ? event.price : event.price * 0.6;
                    return (
                      <div key={eventId} className="flex justify-between text-[#CCCCCC]">
                        <span>{event.name} ({duration === 'full' ? 'Full Day' : 'Half Day'})</span>
                        <span>₹{price.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </>
              )}

              <h3 className="text-[#C9A84C] font-bold mb-2 mt-4">Album:</h3>
              <div className="flex justify-between text-[#CCCCCC]">
                <span>{albumType === 'small' ? '8×24 Small' : '12×36 Large'} Album ({albumPages} pages)</span>
                <span>₹{((albumPages * (albumType === 'small' ? 70 : 100)) + (albumType === 'small' ? 500 : 700)).toLocaleString()}</span>
              </div>

              {addons.size > 0 && (
                <>
                  <h3 className="text-[#C9A84C] font-bold mb-2 mt-4">Add-ons:</h3>
                  {Array.from(addons).map(addonId => {
                    const addon = addonServices.find(a => a.id === addonId);
                    if (!addon) return null;
                    return (
                      <div key={addonId} className="flex justify-between text-[#CCCCCC]">
                        <span>{addon.name}</span>
                        <span>₹{addon.price.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div className="h-px bg-[#C9A84C] my-6" />

            <div className="flex justify-between text-2xl font-bold text-[#C9A84C]">
              <span>Total</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>

            <div className="grid md:grid-cols-1 gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={generateBill}
                className="py-3 bg-[#C9A84C] text-[#0A0A0A] rounded-lg font-bold"
              >
                Generate Bill
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PAY VIA UPI SECTION ── */}
      <section className="upi-section">
        <h2 className="upi-title">Pay via UPI</h2>

        <div className="upi-card">
          {/* QR Code */}
          <div className="qr-wrapper">
            <img
              src="/phonepe-qr.jpg"
              alt="PhonePe QR Code - Master Harshal Sanjay Falke"
              className="qr-image"
            />
            <p className="qr-name">Master HARSHAL SANJAY FALKE</p>
            <p className="qr-sub">Scan using PhonePe / GPay / Any UPI App</p>

            {/* Download Button */}
            <a
              href="/phonepe-qr.jpg"
              download="HarshPhalke_PaymentQR.jpg"
              className="btn-download"
            >
              ⬇ Download QR Code
            </a>
          </div>

          {/* Divider */}
          <div className="upi-divider" />

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/917720049725?text=Hi%20Harsh%20Phalke%20Films%2C%20I%20would%20like%20to%20book%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            {/* WhatsApp SVG Logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="22"
              height="22"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
                -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075
                -.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059
                -.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
                .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52
                -.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51
                -.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
                -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074
                .149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625
                .712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413
                .248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.428
                a.75.75 0 00.916.916l5.573-1.471A11.943 11.943 0 0012 24
                c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75
                a9.707 9.707 0 01-4.95-1.355l-.355-.211-3.685.972.986-3.595
                -.231-.371A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25
                S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
            </svg>
            Contact on WhatsApp
          </a>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#1E1E1E]/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl mb-8 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Book Your Shoot
            </h2>
          </motion.div>

          {!bookingSuccess ? (
            <div className="bg-[#1E1E1E] p-8 rounded-lg">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-[#CCCCCC] mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full bg-[#0A0A0A] border-2 ${!!formErrors.fullName ? 'border-red-500' : 'border-[#C9A84C]/30'
                      } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && (
                    <p style={{
                      color: '#ff4444',
                      fontSize: '11px',
                      marginTop: '4px',
                      marginLeft: '2px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      ❌ {formErrors.fullName}
                    </p>
                  )}
                  {!!formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">❌ This field is required</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm text-[#CCCCCC] mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full bg-[#0A0A0A] border-2 ${formErrors.phone ? 'border-red-500' : 'border-[#C9A84C]/30'
                      } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {formErrors.phone && (
                    <p style={{
                      color: '#ff4444',
                      fontSize: '11px',
                      marginTop: '4px',
                      marginLeft: '2px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      ❌ {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm text-[#CCCCCC] mb-2">Event Type *</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className={`w-full bg-[#0A0A0A] border-2 ${formErrors.eventType ? 'border-red-500' : 'border-[#C9A84C]/30'
                      } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                  >
                    <option value="">Select event type</option>
                    {[...eventCategories.priority, ...eventCategories.other].map(event => (
                      <option key={event.id} value={event.name}>{event.name}</option>
                    ))}
                  </select>
                  {formErrors.eventType && (
                    <p style={{
                      color: '#ff4444',
                      fontSize: '11px',
                      marginTop: '4px',
                      marginLeft: '2px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      ❌ {formErrors.eventType}
                    </p>
                  )}
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm text-[#CCCCCC] mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className={`w-full bg-[#0A0A0A] border-2 ${formErrors.eventDate ? 'border-red-500' : 'border-[#C9A84C]/30'
                      } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.eventDate && (
                    <p style={{
                      color: '#ff4444',
                      fontSize: '11px',
                      marginTop: '4px',
                      marginLeft: '2px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      ❌ {formErrors.eventDate}
                    </p>
                  )}
                </div>

                {/* Location / Venue */}
                <div>
                  <label className="block text-sm text-[#CCCCCC] mb-2">Location / Venue *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full bg-[#0A0A0A] border-2 ${formErrors.location ? 'border-red-500' : 'border-[#C9A84C]/30'
                      } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                    placeholder="Enter venue or location"
                  />
                  {formErrors.location && (
                    <p style={{
                      color: '#ff4444',
                      fontSize: '11px',
                      marginTop: '4px',
                      marginLeft: '2px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      ❌ {formErrors.location}
                    </p>
                  )}
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm text-[#CCCCCC] mb-2">Total Amount</label>
                  <input
                    type="text"
                    value={`₹${calculateTotal().toLocaleString()}`}
                    readOnly
                    className="w-full bg-[#0A0A0A] border-2 border-[#C9A84C] rounded-lg px-4 py-3 outline-none text-[#C9A84C] font-bold"
                  />
                </div>

                {/* Generated Bill Preview */}
                <div>
                  <label className="block text-sm text-[#888888] mb-2">📄 Your Generated Bill (Auto-attached)</label>
                  {billImageBase64 ? (
                    <div style={{
                      background: '#141414',
                      border: '1px solid #C9A84C',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <img
                        src={billImageBase64}
                        alt="Bill Preview"
                        style={{
                          width: '56px',
                          height: '72px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #2D2D2D'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'white',
                          marginBottom: '2px'
                        }}>
                          📎 Bill_HarshPhalke_{formData.fullName || 'Customer'}.jpg
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#4CAF50'
                        }}>
                          ✅ Auto-attached — ready to send
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const modal = document.createElement('div');
                          modal.style.cssText = `
                            position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                            background: rgba(0,0,0,0.9); z-index: 9999; 
                            display: flex; align-items: center; justify-content: center;
                            padding: 20px;
                          `;
                          modal.innerHTML = `
                            <div style="position: relative; max-width: 90%; max-height: 90%;">
                              <img src="${billImageBase64}" style="max-width: 100%; max-height: 100%; border-radius: 8px;" />
                              <button onclick="this.parentElement.parentElement.remove()" 
                                style="position: absolute; top: -10px; right: -10px; 
                                background: #C9A84C; color: black; border: none; 
                                width: 30px; height: 30px; border-radius: 50%; 
                                cursor: pointer; font-weight: bold;">×</button>
                            </div>
                          `;
                          document.body.appendChild(modal);
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #C9A84C',
                          color: '#C9A84C',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        👁️ Preview
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      background: '#0F0F0F',
                      border: '2px dashed #2D2D2D',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '11px',
                        color: '#888888',
                        marginBottom: '8px'
                      }}>
                        ⚠️ No bill generated yet
                      </div>
                      <button
                        onClick={() => scrollToSection('services')}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#C9A84C',
                          fontSize: '11px',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        ← Go back and generate your bill first
                      </button>
                    </div>
                  )}
                </div>

                {/* Message / Notes */}
                <div>
                  <label className="block text-sm text-[#CCCCCC] mb-2">Message / Notes</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#0A0A0A] border-2 border-[#C9A84C]/30 focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors h-24 resize-none"
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                {/* Info Toast */}
                <div style={{
                  background: '#1A1A1A',
                  border: '1px solid #C9A84C',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#C9A84C',
                    lineHeight: '1.4'
                  }}>
                    📎 WhatsApp will open with your booking details. Please manually attach the downloaded bill in the chat.
                  </div>
                </div>

                {/* Upload progress indicator */}
                {isSubmitting && uploadStep && (
                  <div style={{
                    textAlign: 'center',
                    padding: '12px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: '#C9A84C',
                    fontStyle: 'italic',
                    background: 'rgba(201,168,76,0.08)',
                    borderRadius: '8px',
                    border: '1px solid rgba(201,168,76,0.2)'
                  }}>
                    ⏳ {uploadStep}
                  </div>
                )}

                {/* Error message */}
                {submitStatus === 'error' && uploadError && (
                  <div style={{
                    textAlign: 'center',
                    padding: '12px 16px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: '#ff4444',
                    background: 'rgba(255,68,68,0.08)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,68,68,0.2)'
                  }}>
                    ❌ {uploadError}
                  </div>
                )}

                {/* Confirm Booking Button */}
                {submitStatus !== 'success' && (
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      background: isSubmitting ? '#8a7232' : '#C9A84C',
                      color: '#000000',
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: '700',
                      fontSize: '15px',
                      padding: '18px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.75 : 1,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span style={{
                          display: 'inline-block',
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(0,0,0,0.3)',
                          borderTopColor: '#000',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                        Processing Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                )}

                {/* Spin animation */}
                <style>{`@keyframes spin {to { transform: rotate(360deg); }}`}</style>

                {/* SUCCESS SCREEN */}
                {submitStatus === 'success' && (
                  <div style={{
                    background: '#0F0F0F',
                    border: '1px solid #C9A84C',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '22px',
                      color: '#ffffff',
                      marginBottom: '8px'
                    }}>Booking Sent Successfully!</h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#888888',
                      marginBottom: '24px',
                      lineHeight: '1.7'
                    }}>
                      Harsh received your booking details, invoice and payment proof on WhatsApp. He will confirm within 24 hours.
                    </p>
                    <div style={{
                      background: '#141414',
                      border: '1px solid #2D2D2D',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      textAlign: 'left',
                      marginBottom: '24px',
                      fontSize: '13px',
                      lineHeight: '2.2'
                    }}>
                      <div><span style={{ color: '#888' }}>Event  : </span><span style={{ color: '#fff' }}>{formData.eventType}</span></div>
                      <div><span style={{ color: '#888' }}>Date   : </span><span style={{ color: '#fff' }}>{formData.eventDate}</span></div>
                      <div><span style={{ color: '#888' }}>Venue  : </span><span style={{ color: '#fff' }}>{formData.location}</span></div>
                      <div><span style={{ color: '#888' }}>Amount : </span><span style={{ color: '#C9A84C', fontWeight: '700' }}>₹{calculateTotal().toLocaleString()}</span></div>
                    </div>
                    <button
                      onClick={() => {
                        setSubmitStatus('idle');
                        setFormData({
                          fullName: '', phone: '', eventType: '',
                          eventDate: '', location: '', message: ''
                        });
                        setUploadError('');
                        setFormErrors({});
                        setBillImageBase64(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #2D2D2D',
                        color: '#888888',
                        fontSize: '13px',
                        padding: '12px 32px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    >
                      Book Another Shoot
                    </button>
                  </div>
                )}

                {submitStatus === 'idle' && (
                  <p className="text-center text-sm text-[#888888]">
                    Or{' '}
                    <a
                      href="https://wa.me/917720049725"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C9A84C] hover:underline"
                    >
                      WhatsApp us directly: +91 77200 49725
                    </a>
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Success State */
            <div style={{
              background: '#0F0F0F',
              border: '1px solid #C9A84C',
              borderRadius: '16px',
              padding: '48px 40px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '64px',
                color: '#4CAF50',
                marginBottom: '24px'
              }}>✅</div>

              <h3 style={{
                fontFamily: 'serif',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '12px'
              }}>
                Booking Request Sent Successfully!
              </h3>

              <p style={{
                fontSize: '13px',
                color: '#888888',
                marginBottom: '24px'
              }}>
                Harsh will confirm your booking within 24 hours on WhatsApp.
              </p>

              <div style={{
                background: '#141414',
                border: '1px solid #2D2D2D',
                borderRadius: '8px',
                padding: '16px 20px',
                textAlign: 'left',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '12px', color: '#C9A84C', marginBottom: '8px' }}>
                  Booking Summary:
                </div>
                <div style={{ fontSize: '12px', color: '#C9A84C', lineHeight: '1.6' }}>
                  📋 {formData.eventType} · {formData.eventDate}<br />
                  📍 {formData.location}<br />
                  💰 ₹{calculateTotal().toLocaleString()}
                </div>
              </div>

              <button
                onClick={resetBookingForm}
                style={{
                  background: 'transparent',
                  border: '1px solid #C9A84C',
                  color: '#C9A84C',
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Book Another Shoot
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl mb-12 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get in Touch
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.a
              href="https://wa.me/917720049725?text=Hi%20Harsh%2C%20I%20want%20to%20enquire%20about%20a%20shoot."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="bg-[#1E1E1E] p-8 rounded-lg text-center hover:bg-[#25D366]/10 transition-colors"
            >
              <Phone className="w-12 h-12 text-[#25D366] mx-auto mb-4" />
              <h3 className="font-bold mb-2">WhatsApp</h3>
              <p className="text-[#CCCCCC] text-sm">+91 77200 49725</p>
              <p className="text-[#888888] text-xs mt-2">Chat with us</p>
            </motion.a>

            <motion.a
              href="tel:+917720049725"
              whileHover={{ y: -5 }}
              className="bg-[#1E1E1E] p-8 rounded-lg text-center hover:bg-[#C9A84C]/10 transition-colors"
            >
              <Phone className="w-12 h-12 text-[#C9A84C] mx-auto mb-4" />
              <h3 className="font-bold mb-2">Phone Call</h3>
              <p className="text-[#CCCCCC] text-sm">+91 77200 49725</p>
              <p className="text-[#888888] text-xs mt-2">Call directly</p>
            </motion.a>

            <motion.a
              href="https://instagram.com/harsh_phalke_films"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="bg-[#1E1E1E] p-8 rounded-lg text-center hover:bg-[#E1306C]/10 transition-colors"
            >
              <Instagram className="w-12 h-12 text-[#E1306C] mx-auto mb-4" />
              <h3 className="font-bold mb-2">Instagram</h3>
              <p className="text-[#CCCCCC] text-sm">@HARSH_PHALKE_FILMS</p>
              <p className="text-[#888888] text-xs mt-2">Follow our work</p>
            </motion.a>
          </div>

          <div className="text-center space-y-2 text-[#CCCCCC]">
            <a
              href="mailto:harshphalke05@gmail.com"
              className="flex items-center justify-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              <Mail className="w-5 h-5 text-[#C9A84C]" />
              <span>harshphalke05@gmail.com</span>
            </a>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-[#C9A84C]" />
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>

          <p
            className="text-center text-2xl mt-12 italic text-[#C9A84C]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Let's create something beautiful together.
          </p>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#1E1E1E]/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl mb-12 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Terms & Conditions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {terms.map((term, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1E1E1E] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTerm(expandedTerm === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#C9A84C]/5 transition-colors"
                >
                  <span className="font-bold text-[#F5F0E8]">{term.title}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C9A84C] transition-transform ${expandedTerm === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {expandedTerm === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4 text-[#888888]"
                  >
                    {term.content}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#1E1E1E] z-50 p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Camera className="w-6 h-6 text-[#C9A84C]" />
                  <div>
                    <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                      HARSH PHALKE
                    </div>
                    <div className="text-xs text-[#C9A84C]">PHOTO & FILMS</div>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-[#C9A84C]" />
                </button>
              </div>

              <div className="space-y-4">
                {['Home', 'About', 'Services', 'Contact'].map(item => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full text-left py-3 px-4 rounded-lg hover:bg-[#C9A84C]/10 text-[#F5F0E8] transition-colors"
                  >
                    {item}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setPortfolioOpen(true);
                  }}
                  className="block w-full text-left py-3 px-4 rounded-lg hover:bg-[#C9A84C]/10 text-[#F5F0E8] transition-colors"
                >
                  Portfolio
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Portfolio Modal */}
      <AnimatePresence>
        {portfolioOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPortfolioOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex items-start justify-center overflow-y-auto"
            style={{ paddingTop: '140px', paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '2rem' }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1E1E1E] rounded-lg p-6 md:p-8 max-w-6xl w-full relative mb-8"
            >
              <button
                onClick={() => setPortfolioOpen(false)}
                className="absolute top-4 right-4 text-[#C9A84C] hover:text-[#F5F0E8] transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl mb-3" 
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Our Portfolio
              </motion.h2>
              
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#CCCCCC] mb-8"
              >
                Explore our collection of cinematic photography and videography work.
              </motion.p>
              
              {/* Premium Masonry Gallery Grid */}
              <div className="portfolio-gallery mb-8">
                {/* Row 1: 2 large landscape photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] mb-[10px]">
                  {portfolioImages.slice(0, 2).map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.2 + (index * 0.08),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="portfolio-item"
                      onClick={() => openLightbox(index)}
                      style={{ height: '280px' }}
                    >
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        loading="eager"
                        className="portfolio-image"
                        style={{ objectPosition: 'center 30%' }}
                      />
                      <div className="portfolio-shimmer" />
                      <div className="portfolio-overlay" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Row 2: 2 portrait photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] mb-[10px]">
                  {portfolioImages.slice(2, 4).map((image, index) => (
                    <motion.div
                      key={index + 2}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.2 + ((index + 2) * 0.08),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="portfolio-item"
                      onClick={() => openLightbox(index + 2)}
                      style={{ height: '380px' }}
                    >
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        loading="eager"
                        className="portfolio-image"
                      />
                      <div className="portfolio-shimmer" />
                      <div className="portfolio-overlay" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Row 3: 3 mixed photos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px] mb-[10px]">
                  {portfolioImages.slice(4, 7).map((image, index) => (
                    <motion.div
                      key={index + 4}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.2 + ((index + 4) * 0.08),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="portfolio-item"
                      onClick={() => openLightbox(index + 4)}
                      style={{ height: '300px' }}
                    >
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        loading="eager"
                        className="portfolio-image"
                      />
                      <div className="portfolio-shimmer" />
                      <div className="portfolio-overlay" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Row 4: 1 portrait photo */}
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.2 + (7 * 0.08),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="portfolio-item mb-[10px]"
                  onClick={() => openLightbox(7)}
                  style={{ height: '400px', maxWidth: '600px', margin: '0 auto' }}
                >
                  <img 
                    src={portfolioImages[7].src} 
                    alt={portfolioImages[7].alt}
                    loading="eager"
                    className="portfolio-image"
                  />
                  <div className="portfolio-shimmer" />
                  <div className="portfolio-overlay" />
                </motion.div>
              </div>
              
              {/* Instagram Button */}
              <motion.a
                href="https://www.instagram.com/HARSH_PHALKE_FILMS"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="portfolio-instagram-btn flex items-center justify-center gap-3 py-4 bg-[#C9A84C] text-[#0A0A0A] rounded-lg font-bold transition-all hover:bg-[#d4af37]"
              >
                <Instagram className="w-5 h-5" />
                View Full Portfolio on Instagram
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Fullscreen Viewer */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="lightbox-close"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Photo Container */}
            <motion.div
              key={currentPhotoIndex}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={portfolioImages[currentPhotoIndex].src}
                alt={portfolioImages[currentPhotoIndex].alt}
                className="lightbox-image"
              />
              
              {/* Caption */}
              <p className="lightbox-caption">
                {portfolioImages[currentPhotoIndex].caption}
              </p>
            </motion.div>
            
            {/* Navigation Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="lightbox-arrow lightbox-arrow-left"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="lightbox-arrow lightbox-arrow-right"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Photo Counter */}
            <div className="lightbox-counter">
              {currentPhotoIndex + 1} / {portfolioImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Detail Modal */}
      <AnimatePresence>
        {expandedAbout !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedAbout(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1E1E1E] rounded-lg p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setExpandedAbout(null)}
                className="absolute top-4 right-4 text-[#C9A84C] hover:text-[#F5F0E8]"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <div className="text-5xl mb-4">{aboutDetails[expandedAbout].icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-[#C9A84C]">
                  {aboutDetails[expandedAbout].title}
                </h3>
                <p className="text-[#CCCCCC] leading-relaxed">
                  {aboutDetails[expandedAbout].fullContent}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Zoom Overlays */}
      <AnimatePresence>
        {qrZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQrZoom(null)}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                onClick={() => setQrZoom(null)}
                className="absolute -top-12 right-0 text-[#C9A84C] hover:text-[#F5F0E8]"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={qrZoom === 'phonepe' ? phonepeQR : instagramQR}
                alt={qrZoom === 'phonepe' ? 'PhonePe QR Code' : 'Instagram QR Code'}
                className="max-w-md w-full h-auto rounded-lg shadow-2xl"
              />
              <p className="text-center mt-4 text-[#CCCCCC]">
                {qrZoom === 'phonepe' ? 'Master HARSHAL SANJAY FALKE' : '@HARSH_PHALKE_FILMS'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Invoice Modal */}
      <AnimatePresence>
        {billPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBillPreview(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '40px 20px',
              boxSizing: 'border-box',
              zIndex: 1000,
              background: 'rgba(0,0,0,0.85)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              style={{
                background: '#0F0F0F',
                border: '1px solid #C9A84C',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '620px',
                padding: '0',
                boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.08)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                overflowY: 'auto',
                overflowX: 'hidden',
                maxHeight: '85vh',
                height: 'auto',
                scrollBehavior: 'smooth'
              }}
            >
              <div ref={billRef}>
                {/* Header Band */}
                <div style={{
                  background: '#0A0A0A',
                  padding: '32px 40px',
                  borderBottom: '1px solid #2D2D2D',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  alignItems: 'start',
                  gap: '20px'
                }}>
                  {/* Left Column */}
                  <div>
                    <Camera style={{ width: '28px', height: '28px', color: '#C9A84C', marginBottom: '8px' }} />
                    <div style={{
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: 'white',
                      lineHeight: '1.2'
                    }}>HARSH PHALKE</div>
                    <div style={{
                      fontWeight: '500',
                      fontSize: '10px',
                      color: '#C9A84C',
                      letterSpacing: '3px',
                      marginBottom: '4px'
                    }}>PHOTO & FILMS</div>
                    <div style={{
                      fontSize: '10px',
                      color: '#888888'
                    }}>Pune, Maharashtra</div>
                  </div>

                  {/* Center Column */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'serif',
                      fontWeight: '900',
                      fontSize: '32px',
                      color: 'white',
                      marginBottom: '8px'
                    }}>INVOICE</div>
                    <div style={{
                      width: '60px',
                      height: '1px',
                      background: '#C9A84C',
                      margin: '0 auto'
                    }}></div>
                  </div>

                  {/* Right Column */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '9px', color: '#888888' }}>Invoice No:</div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#C9A84C' }}>{invoiceNumber}</div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '9px', color: '#888888' }}>Date:</div>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>{new Date().toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', color: '#888888' }}>Customer:</div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{customerName}</div>
                    </div>
                  </div>
                </div>

                {/* Gold Accent Strip */}
                <div style={{
                  height: '3px',
                  background: 'linear-gradient(to right, transparent, #C9A84C, #E8C96A, #C9A84C, transparent)',
                  width: '100%'
                }}></div>

                {/* Bill Body */}
                <div style={{
                  padding: '32px 40px',
                  background: '#0F0F0F'
                }}>
                  {/* Events Section */}
                  {selectedEvents.size > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #1E1E1E'
                      }}>
                        <span style={{ fontSize: '14px' }}>🎉</span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#C9A84C',
                          textTransform: 'uppercase',
                          letterSpacing: '2px'
                        }}>EVENTS</span>
                      </div>
                      {Array.from(selectedEvents).map(eventId => {
                        const event = [...eventCategories.priority, ...eventCategories.other].find(e => e.id === eventId);
                        if (!event) return null;
                        const duration = eventDurations.get(eventId) || 'full';
                        const price = duration === 'full' ? event.price : event.price * 0.6;
                        return (
                          <div key={eventId} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: '1px dotted #1E1E1E'
                          }}>
                            <span style={{
                              fontSize: '13px',
                              color: '#E0E0E0'
                            }}>
                              {event.name} <span style={{ color: '#888888' }}>({duration === 'full' ? 'Full Day' : 'Half Day'})</span>
                            </span>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: 'bold',
                              color: 'white'
                            }}>₹{price.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Album Section */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid #1E1E1E'
                    }}>
                      <span style={{ fontSize: '14px' }}>📖</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#C9A84C',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                      }}>ALBUM</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px dotted #1E1E1E'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#E0E0E0'
                      }}>
                        {albumType === 'small' ? '8×24 Small' : '12×36 Large'} Album ({albumPages} pages)
                      </span>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        ₹{((albumPages * (albumType === 'small' ? 70 : 100)) + (albumType === 'small' ? 500 : 700)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Add-ons Section */}
                  {addons.size > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #1E1E1E'
                      }}>
                        <span style={{ fontSize: '14px' }}>✨</span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#C9A84C',
                          textTransform: 'uppercase',
                          letterSpacing: '2px'
                        }}>ADD-ONS</span>
                      </div>
                      {Array.from(addons).map(addonId => {
                        const addon = addonServices.find(a => a.id === addonId);
                        if (!addon) return null;
                        return (
                          <div key={addonId} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: '1px dotted #1E1E1E'
                          }}>
                            <span style={{
                              fontSize: '13px',
                              color: '#E0E0E0'
                            }}>{addon.name}</span>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: 'bold',
                              color: 'white'
                            }}>₹{addon.price.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* No Services Message */}
                  {selectedEvents.size === 0 && addons.size === 0 && (
                    <div style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      fontStyle: 'italic',
                      color: '#555555',
                      padding: '40px 0'
                    }}>
                      No services selected yet.
                    </div>
                  )}
                </div>

                {/* Subtotal Area */}
                <div style={{
                  background: '#141414',
                  borderTop: '1px solid #2D2D2D',
                  padding: '20px 40px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#888888'
                  }}>
                    <span>Subtotal</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Total Band */}
                <div style={{
                  background: 'linear-gradient(135deg, #1A1500, rgba(201,168,76,0.13))',
                  borderTop: '2px solid #C9A84C',
                  borderBottom: '2px solid #C9A84C',
                  padding: '20px 40px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '900',
                      color: 'white',
                      letterSpacing: '2px'
                    }}>TOTAL INVESTMENT</span>
                    <span style={{
                      fontFamily: 'serif',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#C9A84C'
                    }}>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Thank You Row */}
                <div style={{
                  padding: '16px 40px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontFamily: 'serif',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: '#888888',
                    marginBottom: '8px'
                  }}>
                    Thank you for choosing Harsh Phalke Films & Photography!
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#C9A84C',
                    letterSpacing: '4px'
                  }}>✦ ✦ ✦</div>
                </div>

                {/* Terms Strip */}
                <div style={{
                  background: '#080808',
                  padding: '14px 40px',
                  borderTop: '1px solid #1E1E1E',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '8px',
                    color: '#555555',
                    lineHeight: '1.4'
                  }}>
                    Terms: 50% advance non-refundable · Balance due on shoot day · RAW files not shared · Travel charges extra if applicable
                  </div>
                </div>

                {/* Footer Buttons Row */}
                <div style={{
                  padding: '24px 40px',
                  background: '#0A0A0A',
                  borderTop: '1px solid #2D2D2D',
                  display: 'flex',
                  gap: '16px'
                }}>
                  <button
                    onClick={() => setBillPreview(false)}
                    style={{
                      flex: '1',
                      background: 'transparent',
                      border: '1px solid #2D2D2D',
                      color: '#888888',
                      fontSize: '13px',
                      fontWeight: '500',
                      padding: '14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#C9A84C';
                      e.target.style.color = '#C9A84C';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#2D2D2D';
                      e.target.style.color = '#888888';
                    }}
                  >
                    ← Back / Edit
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    style={{
                      flex: '2',
                      background: isGeneratingPDF ? '#B8954A' : '#C9A84C',
                      color: '#000000',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      padding: '14px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                      opacity: isGeneratingPDF ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isGeneratingPDF) {
                        e.target.style.background = '#E8C96A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isGeneratingPDF) {
                        e.target.style.background = '#C9A84C';
                      }
                    }}
                  >
                    {isGeneratingPDF ? '⏳ Generating PDF...' : '⬇ Download Invoice'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Success Overlay */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E1E1E] rounded-lg p-10 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 text-[#C9A84C]" style={{ fontFamily: 'var(--font-display)' }}>
                Booking Confirmed!
              </h2>
              <p className="text-[#CCCCCC] mb-8">
                We'll contact you on WhatsApp shortly to confirm the details.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setBookingSuccess(false);
                  scrollToSection('home');
                }}
                className="w-full py-3 bg-[#C9A84C] text-[#0A0A0A] rounded-full font-bold"
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-[#C9A84C]/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Camera className="w-6 h-6 text-[#C9A84C]" />
              <div>
                <div className="font-bold tracking-wider text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                  HARSH PHALKE
                </div>
                <div className="text-xs tracking-widest text-[#C9A84C]">PHOTO & FILMS</div>
              </div>
            </button>

            <p
              className="text-center italic text-[#888888]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Stories Today. Memories Forever.
            </p>

            <div className="flex gap-6">
              <a
                href="https://instagram.com/harsh_phalke_films"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-[#C9A84C] hover:text-[#F5F0E8] transition-colors" />
              </a>
              <a
                href="https://wa.me/917720049725"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5 text-[#C9A84C] hover:text-[#F5F0E8] transition-colors" />
              </a>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-[#888888]">
            © 2025 Harsh Phalke Films And Photography · Pune, Maharashtra · harshphalke05@gmail.com
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
