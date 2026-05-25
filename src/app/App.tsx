import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Camera, Phone, Instagram, Mail, MapPin, ChevronDown, Check, X, Menu, ZoomIn, CheckCircle, Printer, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import phonepeQR from '../imports/WhatsApp_Image_2026-05-22_at_10.00.08_PM.jpeg';
import instagramQR from '../imports/WhatsApp_Image_2026-05-22_at_10.00.07_PM.jpeg';
import logo from '../imports/Logo.jpeg';
import portfolio1 from '../imports/portfolio_images/3G0A8995.jpg.jpeg';
import portfolio2 from '../imports/portfolio_images/3G0A9004.jpg.jpeg';
import portfolio3 from '../imports/portfolio_images/3G0A9159.jpg.jpeg';
import portfolio4 from '../imports/portfolio_images/3G0A9338.jpg.jpeg';
import portfolio5 from '../imports/portfolio_images/IMG_4147.jpg.jpeg';
import portfolio6 from '../imports/portfolio_images/IMG_4155.jpg.jpeg';
import portfolio7 from '../imports/portfolio_images/MHPL6847.jpg.jpeg';
import portfolio8 from '../imports/portfolio_images/MHPL7323.jpg.jpeg';

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
  const billRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    eventType: '',
    eventDate: '',
    location: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Set<string>>(new Set());

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
    if (!billRef.current) return;

    setIsGeneratingPDF(true);
    toast.info('Generating PDF...');

    try {
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0F0F0F',
        logging: false,
        allowTaint: true
      });

      const imgData = canvas.getImageData(0, 0, canvas.width, canvas.height);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const today = new Date();
      const dateStr = today.getDate().toString().padStart(2, '0') +
        (today.getMonth() + 1).toString().padStart(2, '0') +
        today.getFullYear();
      const filename = `HarshPhalke_Invoice_${customerName.replace(/\s+/g, '')}_${dateStr}.pdf`;

      pdf.save(filename);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
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

            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={generateBill}
                className="py-3 bg-[#C9A84C] text-[#0A0A0A] rounded-lg font-bold"
              >
                Generate Bill
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePrint}
                className="py-3 border-2 border-[#C9A84C] text-[#C9A84C] rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print / Download
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
            href="https://wa.me/917720049725?text=Hi%20Harsh%20Phalke%20Films%2C%20I%20have%20made%20the%20payment.%20Please%20find%20my%20screenshot%20attached."
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
            Send Screenshot on WhatsApp
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

          <div className="bg-[#1E1E1E] p-8 rounded-lg">
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#CCCCCC] mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full bg-[#0A0A0A] border-2 ${formErrors.has('fullName') ? 'border-red-500' : 'border-[#C9A84C]/30'
                    } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                  placeholder="Enter your full name"
                />
                {formErrors.has('fullName') && (
                  <p className="text-red-500 text-xs mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#CCCCCC] mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full bg-[#0A0A0A] border-2 ${formErrors.has('phone') ? 'border-red-500' : 'border-[#C9A84C]/30'
                    } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                  placeholder="+91 XXXXX XXXXX"
                />
                {formErrors.has('phone') && (
                  <p className="text-red-500 text-xs mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#CCCCCC] mb-2">Event Type *</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className={`w-full bg-[#0A0A0A] border-2 ${formErrors.has('eventType') ? 'border-red-500' : 'border-[#C9A84C]/30'
                    } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                >
                  <option value="">Select event type</option>
                  {[...eventCategories.priority, ...eventCategories.other].map(event => (
                    <option key={event.id} value={event.name}>{event.name}</option>
                  ))}
                </select>
                {formErrors.has('eventType') && (
                  <p className="text-red-500 text-xs mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#CCCCCC] mb-2">Event Date *</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className={`w-full bg-[#0A0A0A] border-2 ${formErrors.has('eventDate') ? 'border-red-500' : 'border-[#C9A84C]/30'
                    } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                />
                {formErrors.has('eventDate') && (
                  <p className="text-red-500 text-xs mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#CCCCCC] mb-2">Location / Venue *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full bg-[#0A0A0A] border-2 ${formErrors.has('location') ? 'border-red-500' : 'border-[#C9A84C]/30'
                    } focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors`}
                  placeholder="Enter venue or location"
                />
                {formErrors.has('location') && (
                  <p className="text-red-500 text-xs mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#CCCCCC] mb-2">Total Amount</label>
                <input
                  type="text"
                  value={`₹${calculateTotal().toLocaleString()}`}
                  readOnly
                  className="w-full bg-[#0A0A0A] border-2 border-[#C9A84C] rounded-lg px-4 py-3 outline-none text-[#C9A84C] font-bold"
                />
              </div>

              <div>
                <label className="block text-sm text-[#CCCCCC] mb-2">Message / Notes</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#0A0A0A] border-2 border-[#C9A84C]/30 focus:border-[#C9A84C] rounded-lg px-4 py-3 outline-none transition-colors h-24 resize-none"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                className="w-full py-4 bg-[#C9A84C] text-[#0A0A0A] rounded-full font-bold text-lg"
              >
                Confirm Booking
              </motion.button>

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
            </div>
          </div>
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
              <svg 
                className="w-12 h-12 text-[#25D366] mx-auto mb-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a0 0 0 0 0 0 0Zm0 0a.5.5 0 0 0 1 0v1a.5.5 0 0 0-1 0v-1a0 0 0 0 0 0 0Zm5.5 3.5a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 1 0v1a0 0 0 0 1 0 0Zm0 0a.5.5 0 0 1-1 0v1a.5.5 0 0 1 1 0v-1a0 0 0 0 1 0 0Z" />
                <path d="M9 12.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-3c-.83 0-1.5.67-1.5 1.5v3Z" />
              </svg>
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

          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setQrZoom('instagram')}
              className="inline-block cursor-pointer relative group"
            >
              <img src={instagramQR} alt="Instagram QR" className="w-48 h-auto mx-auto rounded-lg mb-4" />
              <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/50 transition-colors rounded-lg flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[#888888] mt-2">Click to zoom</p>
            </motion.div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.85)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              ref={billRef}
              className="invoice-modal"
            >
              {/* Header Band */}
              <div className="invoice-header">
                <div className="invoice-header-content">
                  {/* Left Column */}
                  <div className="invoice-header-left">
                    <Camera className="w-7 h-7 text-[#C9A84C] mb-2" />
                    <div className="invoice-brand-name">HARSH PHALKE</div>
                    <div className="invoice-brand-sub">PHOTO & FILMS</div>
                    <div className="invoice-location">Pune, Maharashtra</div>
                  </div>

                  {/* Center Column */}
                  <div className="invoice-header-center">
                    <div className="invoice-title">INVOICE</div>
                    <div className="invoice-title-line"></div>
                  </div>

                  {/* Right Column */}
                  <div className="invoice-header-right">
                    <div className="invoice-meta-row">
                      <span className="invoice-meta-label">Invoice No:</span>
                      <span className="invoice-meta-value">{invoiceNumber}</span>
                    </div>
                    <div className="invoice-meta-row">
                      <span className="invoice-meta-label">Date:</span>
                      <span className="invoice-meta-date">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="invoice-meta-row">
                      <span className="invoice-meta-label">Customer:</span>
                      <span className="invoice-meta-customer">{customerName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gold Accent Strip */}
              <div className="invoice-gold-strip"></div>

              {/* Bill Body */}
              <div className="invoice-body">
                {/* Events Section */}
                {selectedEvents.size > 0 && (
                  <div className="invoice-category">
                    <div className="invoice-category-header">
                      <div className="invoice-category-title">
                        <span className="invoice-category-icon">🎉</span>
                        <span className="invoice-category-name">EVENTS</span>
                      </div>
                    </div>
                    {Array.from(selectedEvents).map(eventId => {
                      const event = [...eventCategories.priority, ...eventCategories.other].find(e => e.id === eventId);
                      if (!event) return null;
                      const duration = eventDurations.get(eventId) || 'full';
                      const price = duration === 'full' ? event.price : event.price * 0.6;
                      return (
                        <div key={eventId} className="invoice-line-item">
                          <span className="invoice-service-name">
                            {event.name} <span className="invoice-duration">({duration === 'full' ? 'Full Day' : 'Half Day'})</span>
                          </span>
                          <span className="invoice-service-price">₹{price.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Album Section */}
                <div className="invoice-category">
                  <div className="invoice-category-header">
                    <div className="invoice-category-title">
                      <span className="invoice-category-icon">📖</span>
                      <span className="invoice-category-name">ALBUM</span>
                    </div>
                  </div>
                  <div className="invoice-line-item">
                    <span className="invoice-service-name">
                      {albumType === 'small' ? '8×24 Small' : '12×36 Large'} Album ({albumPages} pages)
                    </span>
                    <span className="invoice-service-price">
                      ₹{((albumPages * (albumType === 'small' ? 70 : 100)) + (albumType === 'small' ? 500 : 700)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Add-ons Section */}
                {addons.size > 0 && (
                  <div className="invoice-category">
                    <div className="invoice-category-header">
                      <div className="invoice-category-title">
                        <span className="invoice-category-icon">✨</span>
                        <span className="invoice-category-name">ADD-ONS</span>
                      </div>
                    </div>
                    {Array.from(addons).map(addonId => {
                      const addon = addonServices.find(a => a.id === addonId);
                      if (!addon) return null;
                      return (
                        <div key={addonId} className="invoice-line-item">
                          <span className="invoice-service-name">{addon.name}</span>
                          <span className="invoice-service-price">₹{addon.price.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* No Services Message */}
                {selectedEvents.size === 0 && addons.size === 0 && (
                  <div className="invoice-no-services">
                    No services selected yet.
                  </div>
                )}
              </div>

              {/* Subtotal Area */}
              <div className="invoice-subtotal">
                <div className="invoice-subtotal-row">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Total Band */}
              <div className="invoice-total-band">
                <div className="invoice-total-content">
                  <span className="invoice-total-label">TOTAL INVESTMENT</span>
                  <span className="invoice-total-amount">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Thank You Row */}
              <div className="invoice-thank-you">
                <div className="invoice-thank-you-text">
                  Thank you for choosing Harsh Phalke Films & Photography!
                </div>
                <div className="invoice-stars">✦ ✦ ✦</div>
              </div>

              {/* Terms Strip */}
              <div className="invoice-terms">
                Terms: 50% advance non-refundable · Balance due on shoot day · RAW files not shared · Travel charges extra if applicable
              </div>

              {/* Footer Buttons */}
              <div className="invoice-footer">
                <button
                  onClick={() => setBillPreview(false)}
                  className="invoice-btn-back"
                >
                  ← Back / Edit
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="invoice-btn-download"
                >
                  {isGeneratingPDF ? '⏳ Generating PDF...' : '⬇ Download Invoice'}
                </button>
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
