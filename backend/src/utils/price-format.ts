export function formatPrice(amount: number, currency: string, locale = 'tr-TR') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }


  /**
    import { formatPrice } from 'utils/price-format';

const price = formatPrice(60, 'TRY', 'tr-TR'); // "₺60,00"
   */