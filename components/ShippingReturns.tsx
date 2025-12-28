
import React from 'react';
import { Truck, RefreshCw, Clock, Globe, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ShippingReturns: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('shippingReturns')}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('shippingSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Shipping Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl">
              <Truck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('shippingPolicy')}</h2>
          </div>

          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-600" />
                {t('deliveryTimes')}
              </h3>
              <p>
                Standard delivery typically takes 3-5 business days. For express orders, we guarantee delivery within 24-48 hours. Orders placed before 2 PM are processed the same day.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-amber-600" />
                {t('internationalShipping')}
              </h3>
              <p>
                We currently ship to over 50 countries worldwide. International shipping rates are calculated at checkout based on destination and weight. Please note that customs duties may apply.
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                <strong>Note:</strong> During peak seasons and holidays, shipping times may be slightly extended. We appreciate your patience.
              </p>
            </div>
          </div>
        </div>

        {/* Returns Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
              <RefreshCw className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('returnPolicy')}</h2>
          </div>

          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <p>
              We want you to love your purchase. If you are not completely satisfied, you may return items within <strong>30 days</strong> of receipt for a full refund or exchange.
            </p>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <ShieldCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span>Items must be unused, unwashed, and in their original packaging with all tags attached.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span>Return shipping is free for all domestic orders over 500 MAD.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span>Final sale items and gift cards are not eligible for return.</span>
              </li>
            </ul>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('refundProcess')}</h3>
              <p>
                Once we receive your return, please allow 5-7 business days for processing. Refunds will be issued to the original payment method. You will receive an email confirmation once the refund has been processed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
