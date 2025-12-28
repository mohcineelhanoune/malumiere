
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('getInTouch')}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('contactSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('contactInfo')}</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full text-amber-600 dark:text-amber-500 shadow-sm">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('emailUs')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">contact@malumiere.ma</p>
                  <p className="text-gray-600 dark:text-gray-400">info@malumiere.ma</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full text-amber-600 dark:text-amber-500 shadow-sm">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('callUs')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">(+212) 0663195596</p>
                  <p className="text-gray-600 dark:text-gray-400">WhatsApp	(+212) 0700141404</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full text-amber-600 dark:text-amber-500 shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('visitUs')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Showroom : 34, rue Boulmane, RDC Bourgogne, Casablanca<br />
                    Horaires d’ouverture :<br />
                    Lundi à vendredi : 9h30-13h00 – 14h30-18h30<br />
                    Samedi : 9h30-13h00                 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <Send className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('messageSent')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                {t('thankYouContact')}
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-amber-600 dark:text-amber-500 font-medium hover:underline"
              >
                {t('sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('sendMessage')}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('firstName')}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('lastName')}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('emailAddress')}</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('message')}</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder={t('howCanWeHelp')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {t('sendMessage')}
                    <Send className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-[450px] bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 relative group">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.639290621062!2d-122.08624618469227!3d37.42199987982517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sGoogleplex!5e0!3m2!1sen!2sus!4v1611817034986!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy"
          title="Location Map"
          className="grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
        ></iframe>
        
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-xs pointer-events-none">
           <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-amber-600" />
              <h4 className="font-bold text-gray-900 dark:text-white">Headquarters</h4>
           </div>
           <p className="text-xs text-gray-500 dark:text-gray-400">
             123 Innovation Drive, Tech Valley, CA 94043
           </p>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
