/* Domino's UAE self-order kiosk — concept prototype.
   Every screen is a pure function of state, so the same code drives the
   clickable prototype and the static "All screens" board. */

(() => {
  'use strict';

  // ---------- Copy (English / Arabic) ----------

  const COPY = {
    en: {
      hero: 'Hot. Fresh.<br><em>Made for you.</em>', heroSub: 'Order here, skip the queue — ready in about 15 minutes.',
      dealTop: 'Any 2 medium', dealBottom: 'each', touch: 'Touch to start', payFoot: ['Card', 'Apple Pay', 'Google Pay', 'Cash at counter'],
      where: 'Where are you<br>eating today?', whereLead: 'You can change this later.',
      dine: 'Eat in', dineSub: "We'll call your number when it's ready.", take: 'Take away', takeSub: 'Packed hot and sealed to go.',
      back: 'Back', startOver: 'Start over', menu: 'Menu',
      promoTag: 'Today only', promo: 'Any 2 medium · <b>AED 29</b> each', promoBtn: 'Get deal',
      cats: { pizza: 'Pizzas', deals: 'Deals', sides: 'Sides', desserts: 'Desserts', drinks: 'Drinks' },
      itemsCount: n => `${n} items`, from: 'from', add: 'Add', customise: 'Customise',
      emptyCart: 'Tap anything to start your order', review: 'Review order', items: n => `${n} item${n === 1 ? '' : 's'}`,
      size: 'Choose size', crust: 'Choose crust', extras: 'Extra toppings', extrasHint: 'Add as many as you like',
      serves: ['Serves 1', 'Serves 2', 'Serves 3–4'], addToOrder: 'Add to order', update: 'Update item',
      yourOrder: 'Your order', addMore: 'Add more', edit: 'Edit', orderFor: 'Order type',
      complete: 'Complete your meal', added: 'Added',
      couponT: 'Have a coupon?', couponS: 'Scan the code below the screen or tap to enter it',
      couponOnT: 'WELCOME10 applied', couponOnS: '10% off your first kiosk order', remove: 'Remove', apply: 'Enter code',
      subtotal: 'Subtotal', discount: 'Discount', vat: 'Includes VAT (5%)', total: 'Total', toPay: 'Continue to pay',
      payment: 'Payment', amountToPay: 'Amount to pay', inclVat: 'Prices include 5% VAT',
      tapT: 'Card or phone', tapS: 'Tap, insert or swipe', counterT: 'Pay at counter', counterS: 'Cash or card at the till',
      choose: 'Choose how you’d like to pay', chooseS: 'Your order goes to the oven as soon as payment is done.',
      tapNow: 'Tap your card or phone<br>on the reader below', waiting: 'Waiting for payment…', simulate: 'Simulate a successful payment',
      counterNow: 'Print your ticket', counterP: "Take the ticket to the counter and pay there. We'll start your pizza as soon as you've paid.", print: 'Print ticket',
      placed: 'Order placed!', paidVia: 'Payment received', payAtCounter: 'Please pay at the counter',
      orderNo: 'Your order number', track: ['Placed', 'Making', 'Baking', 'Ready'],
      dineMsg: 'Grab a seat. Watch the screen for your number — usually 12–15 minutes.',
      takeMsg: 'Wait near the counter. Watch the screen for your number — usually 12–15 minutes.',
      rate: 'How was ordering today?',
      receipt: 'Take your receipt below', done: 'Done', newIn: s => `Starting a new order in ${s}s`,
      still: 'Still there?', stillP: s => `Your order will be cleared in ${s} seconds.`, stay: "I'm still here",
      reach: 'Accessible view', reachP: 'Everything is now within reach in the lower half of the screen.', reachOff: 'Exit accessible view',
      sizes: { S: 'Small', M: 'Medium', L: 'Large' }, toast: n => `${n} added`, veg: 'Veg', hot: 'Spicy', best: 'Bestseller', newT: 'New',
      dineShort: 'Eat in', takeShort: 'Take away', qty: 'Qty',
    },
    ar: {
      hero: 'ساخنة. طازجة.<br><em>محضّرة لك.</em>', heroSub: 'اطلب من هنا وتجاوز الطابور — جاهزة خلال ١٥ دقيقة تقريباً.',
      dealTop: 'أي بيتزا وسط', dealBottom: 'للحبة', touch: 'المس للبدء', payFoot: ['بطاقة', 'Apple Pay', 'Google Pay', 'نقداً عند الكاونتر'],
      where: 'أين ستتناول<br>طعامك اليوم؟', whereLead: 'يمكنك تغيير ذلك لاحقاً.',
      dine: 'في المطعم', dineSub: 'سننادي رقمك عندما يصبح طلبك جاهزاً.', take: 'سفري', takeSub: 'نغلّفه ساخناً ومحكماً.',
      back: 'رجوع', startOver: 'ابدأ من جديد', menu: 'القائمة',
      promoTag: 'اليوم فقط', promo: '٢ بيتزا وسط <b>29 د.إ</b> للحبة', promoBtn: 'احصل على العرض',
      cats: { pizza: 'البيتزا', deals: 'العروض', sides: 'المقبلات', desserts: 'الحلويات', drinks: 'المشروبات' },
      itemsCount: n => `${n} أصناف`, from: 'يبدأ من', add: 'أضف', customise: 'خصّص',
      emptyCart: 'اختر أي صنف لبدء طلبك', review: 'مراجعة الطلب', items: n => `${n} صنف`,
      size: 'اختر الحجم', crust: 'اختر العجينة', extras: 'إضافات', extrasHint: 'أضف ما تشاء',
      serves: ['لشخص واحد', 'لشخصين', 'لـ ٣–٤ أشخاص'], addToOrder: 'أضف إلى الطلب', update: 'تحديث الصنف',
      yourOrder: 'طلبك', addMore: 'أضف المزيد', edit: 'تعديل', orderFor: 'نوع الطلب',
      complete: 'أكمل وجبتك', added: 'تمت الإضافة',
      couponT: 'لديك قسيمة؟', couponS: 'امسح الرمز أسفل الشاشة أو المس لإدخاله',
      couponOnT: 'تم تطبيق WELCOME10', couponOnS: 'خصم ١٠٪ على أول طلب من الكشك', remove: 'إزالة', apply: 'أدخل الرمز',
      subtotal: 'المجموع الفرعي', discount: 'الخصم', vat: 'شامل ضريبة القيمة المضافة (٥٪)', total: 'الإجمالي', toPay: 'متابعة للدفع',
      payment: 'الدفع', amountToPay: 'المبلغ المستحق', inclVat: 'الأسعار شاملة ضريبة القيمة المضافة ٥٪',
      tapT: 'بطاقة أو هاتف', tapS: 'انقر أو أدخل أو مرّر', counterT: 'الدفع عند الكاونتر', counterS: 'نقداً أو بالبطاقة',
      choose: 'اختر طريقة الدفع', chooseS: 'يدخل طلبك الفرن فور إتمام الدفع.',
      tapNow: 'انقر ببطاقتك أو هاتفك<br>على القارئ في الأسفل', waiting: 'بانتظار الدفع…', simulate: 'محاكاة دفع ناجح',
      counterNow: 'اطبع تذكرتك', counterP: 'خذ التذكرة إلى الكاونتر وادفع هناك. نبدأ بتحضير البيتزا فور الدفع.', print: 'اطبع التذكرة',
      placed: 'تم تأكيد طلبك!', paidVia: 'تم استلام الدفع', payAtCounter: 'يرجى الدفع عند الكاونتر',
      orderNo: 'رقم طلبك', track: ['تم الطلب', 'التحضير', 'في الفرن', 'جاهز'],
      dineMsg: 'تفضّل بالجلوس وتابع الشاشة لرقمك — عادةً ١٢–١٥ دقيقة.',
      takeMsg: 'انتظر قرب الكاونتر وتابع الشاشة لرقمك — عادةً ١٢–١٥ دقيقة.',
      rate: 'كيف كانت تجربة الطلب اليوم؟',
      receipt: 'خذ إيصالك من الأسفل', done: 'تم', newIn: s => `يبدأ طلب جديد خلال ${s} ثانية`,
      still: 'هل ما زلت هنا؟', stillP: s => `سيتم مسح طلبك خلال ${s} ثانية.`, stay: 'نعم، ما زلت هنا',
      reach: 'وضع سهولة الوصول', reachP: 'كل شيء الآن في متناولك في النصف السفلي من الشاشة.', reachOff: 'الخروج من وضع سهولة الوصول',
      sizes: { S: 'صغير', M: 'وسط', L: 'كبير' }, toast: n => `تمت إضافة ${n}`, veg: 'نباتي', hot: 'حار', best: 'الأكثر طلباً', newT: 'جديد',
      dineShort: 'في المطعم', takeShort: 'سفري', qty: 'الكمية',
    },
  };

  // ---------- Menu (illustrative prices, AED, VAT inclusive) ----------
  // Pizza prices are for a Medium; Small and Large are derived in sizePrice().

  const MENU = [
    { id: 'margherita', cat: 'pizza', price: 25.9, tops: ['cheese'], veg: true,
      en: ['Margherita', 'Pizza sauce, 100% mozzarella and oregano'], ar: ['مارغريتا', 'صلصة البيتزا وموتزاريلا ١٠٠٪ وأوريغانو'] },
    { id: 'pepperoni', cat: 'pizza', price: 29.9, tops: ['pepperoni'], tag: 'best',
      en: ['Pepperoni', 'Beef pepperoni and mozzarella'], ar: ['بيبروني', 'بيبروني لحم بقري وموتزاريلا'] },
    { id: 'veggie', cat: 'pizza', price: 31.9, tops: ['onion', 'pepper', 'mushroom', 'olive'], veg: true,
      en: ['Veggie', 'Onions, green peppers, mushrooms and black olives'], ar: ['خضار', 'بصل وفلفل أخضر وفطر وزيتون أسود'] },
    { id: 'chickenbbq', cat: 'pizza', price: 33.9, tops: ['chicken', 'onion'],
      en: ['Chicken BBQ', 'Grilled chicken and onions on a smoky BBQ sauce'], ar: ['دجاج باربكيو', 'دجاج مشوي وبصل مع صلصة باربكيو مدخّنة'] },
    { id: 'tikka', cat: 'pizza', price: 37.9, tops: ['chicken', 'onion', 'pepper'], hot: true, tag: 'best',
      en: ['Chicken Tikka', 'Chicken tikka, onions and green peppers with mint sauce'], ar: ['دجاج تكا', 'دجاج تكا وبصل وفلفل أخضر مع صلصة النعناع'] },
    { id: 'passion', cat: 'pizza', price: 39.9, tops: ['pepperoni', 'cheese'],
      en: ['Pepperoni Passion', 'Extra beef pepperoni and an extra layer of mozzarella'], ar: ['بيبروني باشن', 'بيبروني إضافي وطبقة إضافية من الموتزاريلا'] },
    { id: 'extravaganzza', cat: 'pizza', price: 41.9, tops: ['pepperoni', 'sausage', 'onion', 'pepper', 'mushroom', 'olive'], tag: 'new',
      en: ['ExtravaganZZa', 'Beef pepperoni, Italian sausage, beef, onions, green peppers, mushrooms, black olives and extra mozzarella'],
      ar: ['إكسترافاغانزا', 'بيبروني ونقانق إيطالية ولحم وبصل وفلفل أخضر وفطر وزيتون أسود وموتزاريلا إضافية'] },

    { id: 'solo', cat: 'deals', price: 49.9, art: 'combo', tag: 'best',
      en: ['Solo Meal', 'Medium pizza, garlic bread and a soft drink'], ar: ['الوجبة الفردية', 'بيتزا وسط وخبز بالثوم ومشروب غازي'] },
    { id: 'mixmatch', cat: 'deals', price: 79.9, art: 'mix',
      en: ['Mix N Match', 'Two medium pizzas and chicken wings'], ar: ['ميكس آند ماتش', 'بيتزا وسط عدد ٢ وأجنحة دجاج'] },
    { id: 'duo', cat: 'deals', price: 58, art: 'duo',
      en: ['Two Medium Deal', 'Any 2 medium hand-tossed pizzas at AED 29 each'], ar: ['عرض البيتزا المزدوج', 'أي ٢ بيتزا وسط بعجينة يدوية بـ ٢٩ د.إ للحبة'] },

    { id: 'garlic', cat: 'sides', price: 12.9, art: 'sticks', veg: true,
      en: ['Garlic Bread', 'Oven-baked with garlic butter and herbs'], ar: ['خبز بالثوم', 'مخبوز بالزبدة والثوم والأعشاب'] },
    { id: 'cheesy', cat: 'sides', price: 15.9, art: 'cheesy', veg: true,
      en: ['Cheesy Bread', 'Garlic bread loaded with melted mozzarella'], ar: ['خبز بالجبن', 'خبز بالثوم مع موتزاريلا ذائبة'] },
    { id: 'wedges', cat: 'sides', price: 11.9, art: 'wedges', veg: true,
      en: ['Potato Wedges', 'Seasoned and baked until golden'], ar: ['بطاطس ودجز', 'متبّلة ومخبوزة حتى تصبح ذهبية'] },
    { id: 'wings', cat: 'sides', price: 19.9, art: 'wings', hot: true,
      en: ['Chicken Wings', '6 pieces, hot buffalo or BBQ'], ar: ['أجنحة الدجاج', '٦ قطع، بافلو حار أو باربكيو'] },
    { id: 'kickers', cat: 'sides', price: 18.9, art: 'kickers',
      en: ['Chicken Kickers', '6 crispy breaded chicken bites'], ar: ['تشيكن كيكرز', '٦ قطع دجاج مقرمشة'] },

    { id: 'lava', cat: 'desserts', price: 9.9, art: 'lava', tag: 'best',
      en: ['Choco Lava Cake', 'Warm chocolate cake with a molten centre'], ar: ['كيك الشوكولاتة الذائبة', 'كيك شوكولاتة دافئ بقلب ذائب'] },
    { id: 'brownie', cat: 'desserts', price: 11.9, art: 'brownie',
      en: ['Chocolate Brownie', 'Fudgy, rich and baked fresh'], ar: ['براوني بالشوكولاتة', 'غني وطري ومخبوز طازجاً'] },

    { id: 'cola', cat: 'drinks', price: 7, art: 'cup', color: '#1D3E8A',
      en: ['Cola', '500 ml, ice cold'], ar: ['كولا', '٥٠٠ مل، بارد'] },
    { id: 'lemon', cat: 'drinks', price: 7, art: 'cup', color: '#2E9E48',
      en: ['Lemon & Lime', '500 ml, ice cold'], ar: ['ليمون ولايم', '٥٠٠ مل، بارد'] },
    { id: 'orange', cat: 'drinks', price: 7, art: 'cup', color: '#F07A12',
      en: ['Orange Soda', '500 ml, ice cold'], ar: ['صودا البرتقال', '٥٠٠ مل، بارد'] },
    { id: 'water', cat: 'drinks', price: 3, art: 'water',
      en: ['Mineral Water', '500 ml'], ar: ['مياه معدنية', '٥٠٠ مل'] },
  ];
  const BY_ID = Object.fromEntries(MENU.map(p => [p.id, p]));
  const CATS = ['pizza', 'deals', 'sides', 'desserts', 'drinks'];
  const CAT_ART = { pizza: 'pizza', deals: 'combo', sides: 'sticks', desserts: 'lava', drinks: 'cup' };

  const SIZES = { S: { d: -8, ring: 78 }, M: { d: 0, ring: 100 }, L: { d: 12, ring: 122 } };
  const CRUSTS = [
    { id: 'hand', add: 0, en: ['Hand Tossed', 'Classic, soft and airy'], ar: ['عجينة يدوية', 'كلاسيكية وطرية'] },
    { id: 'thin', add: 0, en: ['Thin & Crispy', 'Light with a crunch'], ar: ['رقيقة ومقرمشة', 'خفيفة ومقرمشة'] },
    { id: 'pan', add: 3, en: ['Pan', 'Thick, buttery, golden'], ar: ['بان', 'سميكة وذهبية بالزبدة'] },
    { id: 'cheesy', add: 8, en: ['Cheesy Crust', 'Mozzarella baked into the edge'], ar: ['حواف بالجبن', 'موتزاريلا داخل الحواف'] },
  ];
  const CRUST = Object.fromEntries(CRUSTS.map(c => [c.id, c]));
  const EXTRA_PRICE = { S: 3, M: 4, L: 5 };
  const TOPPINGS = [
    { id: 'cheese', en: 'Extra cheese', ar: 'جبن إضافي' }, { id: 'pepperoni', en: 'Beef pepperoni', ar: 'بيبروني' },
    { id: 'chicken', en: 'Chicken', ar: 'دجاج' }, { id: 'sausage', en: 'Italian sausage', ar: 'نقانق إيطالية' },
    { id: 'mushroom', en: 'Mushrooms', ar: 'فطر' }, { id: 'olive', en: 'Black olives', ar: 'زيتون أسود' },
    { id: 'onion', en: 'Onions', ar: 'بصل' }, { id: 'pepper', en: 'Green peppers', ar: 'فلفل أخضر' },
    { id: 'tomato', en: 'Tomatoes', ar: 'طماطم' }, { id: 'jalapeno', en: 'Jalapeños', ar: 'هالابينو' },
    { id: 'corn', en: 'Sweetcorn', ar: 'ذرة حلوة' }, { id: 'pineapple', en: 'Pineapple', ar: 'أناناس' },
  ];
  const TOP_NAME = Object.fromEntries(TOPPINGS.map(t => [t.id, t]));

  // ---------- Helpers ----------

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const name = (p, S) => p[S.lang][0];
  const desc = (p, S) => p[S.lang][1];
  const T = S => COPY[S.lang];
  const aed = (v, S) => {
    const n = (Math.round(v * 100) / 100).toFixed(2);
    return S.lang === 'ar' ? `${n} د.إ` : `AED ${n}`;
  };
  const sizePrice = (p, size) => p.price + SIZES[size].d;
  function unitPrice(item) {
    const p = BY_ID[item.pid];
    if (p.cat !== 'pizza') return p.price;
    return sizePrice(p, item.size) + CRUST[item.crust].add + item.extras.length * EXTRA_PRICE[item.size];
  }
  function totals(S) {
    const sub = S.cart.reduce((a, it) => a + unitPrice(it) * it.qty, 0);
    const disc = S.coupon ? Math.round(sub * 10) / 100 : 0;
    const total = sub - disc;
    const vat = total - total / 1.05;
    const count = S.cart.reduce((a, it) => a + it.qty, 0);
    return { sub, disc, total, vat, count };
  }
  const qtyOf = (S, pid) => S.cart.filter(i => i.pid === pid).reduce((a, i) => a + i.qty, 0);

  function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
  function rng(seed) {
    let a = seed;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  // ---------- Icons ----------

  const IC = {
    back: '<path d="M15 18l-6-6 6-6"/>', next: '<path d="M9 18l6-6-6-6"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>', check: '<path d="M5 12.5l4.5 4.5L19 7"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    bag: '<path d="M5 8h14l-1.2 12.2a1 1 0 01-1 .8H7.2a1 1 0 01-1-.8z"/><path d="M9 10V7a3 3 0 016 0v3"/>',
    dine: '<path d="M7 3v8M4.5 3v5a2.5 2.5 0 005 0V3M7 11v10M18 3c-2.2 0-3.5 2.5-3.5 6.5S15.5 14 17 14h1v7"/><path d="M18 3v11"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
    tap: '<path d="M8.5 7.5a6 6 0 010 9M12 5a9.5 9.5 0 010 14M15.5 2.5a13 13 0 010 19"/><circle cx="5" cy="12" r="1.4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
    access: '<circle cx="12" cy="4.2" r="1.7"/><path d="M5 8.5l7 1.2 7-1.2M12 9.7V14l-3.2 6.5M12 14l3.2 6.5"/>',
    restart: '<path d="M4 4v6h6"/><path d="M5.5 15.5A7.5 7.5 0 106 8.3L4 10"/>',
    tag: '<path d="M3 12V4a1 1 0 011-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.6"/>',
    scan: '<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>', down: '<path d="M12 4v16M5 13l7 7 7-7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', oven: '<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="6" y="9" width="12" height="8" rx="1"/><path d="M7 6.5h1M10 6.5h1"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-4 2.5-5 .3 2 1.3 3 2.5 3-1-3 0-6 0-8z"/>',
  };
  const ic = (n, s = 40, w = 2.4, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

  // Placeholder brand mark — swap for the official logo asset in production.
  const logoMark = () => `<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-42 32 32)">
    <rect x="16" y="4" width="32" height="56" rx="7" fill="#fff"/>
    <rect x="19.5" y="7.5" width="25" height="24" rx="4.5" fill="#E31837"/>
    <rect x="19.5" y="32.5" width="25" height="24" rx="4.5" fill="#006491"/>
    <circle cx="32" cy="19.5" r="4" fill="#fff"/><circle cx="26.5" cy="44.5" r="4" fill="#fff"/><circle cx="37.5" cy="44.5" r="4" fill="#fff"/></g></svg>`;
  const logo = (h = 84) => `<span class="logo" style="height:${h}px;font-size:${h}px">${logoMark()}<b>Domino’s</b></span>`;

  // ---------- Food illustrations ----------

  const TOP_SVG = {
    olive: '<circle r="4.6" fill="#1F1B18"/><circle r="1.9" fill="#F4D27A"/>',
    pepper: '<path d="M-6.5 2.5Q0-6 6.5 2.5" stroke="#2F8F3A" stroke-width="3.4" fill="none" stroke-linecap="round"/>',
    onion: '<path d="M-6.5 3Q0-5.5 6.5 3" stroke="#A45BA0" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M-4 3.5Q0-2 4 3.5" stroke="#E2BCDD" stroke-width="1.3" fill="none" stroke-linecap="round"/>',
    tomato: '<circle r="6.4" fill="#D63A2A"/><circle r="4.3" fill="#EF6447"/><circle cx="-1.6" cy="-1" r=".9" fill="#FCE3B0"/><circle cx="1.8" cy=".8" r=".9" fill="#FCE3B0"/>',
    mushroom: '<path d="M-6.5 1Q-6.5-6.5 0-6.5Q6.5-6.5 6.5 1Z" fill="#D9C6AA" stroke="#8F7656" stroke-width="1"/><rect x="-1.9" y="1" width="3.8" height="4.8" rx="1" fill="#EEE3D2" stroke="#8F7656" stroke-width=".8"/>',
    jalapeno: '<circle r="4.4" fill="#3F8F2C"/><circle r="2.8" fill="#9ACD62"/><circle r=".9" fill="#F1F5D0"/>',
    corn: '<circle r="2.7" fill="#F6C21C" stroke="#D99E0C" stroke-width=".6"/>',
    pineapple: '<path d="M-5 4L0-5L5 4Z" fill="#F7D046" stroke="#DDA918" stroke-width=".8" stroke-linejoin="round"/>',
    chicken: '<path d="M-5.5-3Q-1-6.5 4-4.5Q7.5 0 4.5 4.5Q-1 6.5-5.5 3Q-7.5 0-5.5-3Z" fill="#C07A3E" stroke="#8A4E22" stroke-width=".8"/><path d="M-3-1h5M-2 2h4" stroke="#8A4E22" stroke-width=".7" opacity=".6"/>',
    sausage: '<circle r="4.2" fill="#8E4A2A"/><circle cx="-1.2" cy="-1.2" r="1" fill="#C7835A"/><circle cx="1.5" cy="1" r=".7" fill="#5E2C15"/>',
    pepperoni: '<circle r="8.6" fill="#B8302A"/><circle r="8.6" fill="none" stroke="#8E1F1A" stroke-width="1.1"/><circle cx="-3" cy="-2" r="1.1" fill="#E79885"/><circle cx="2.6" cy="2.4" r="1" fill="#E79885"/><circle cx="2" cy="-3" r=".8" fill="#7A1712"/>',
    cheese: '<ellipse rx="7" ry="4.4" fill="#FFF1C4" stroke="#F2C25A" stroke-width=".8"/>',
  };
  const TOP_COUNT = { pepperoni: 9, cheese: 10, corn: 22, sausage: 12 };

  function pizza(tops = [], seed = 'p', extra = '') {
    const r = rng(hash(seed));
    // Gradients live once in index.html (#pz-defs) so hidden copies can't break them.
    let s = `<svg class="pz" viewBox="0 0 200 200" aria-hidden="true" ${extra}>
      <circle cx="100" cy="100" r="97" fill="url(#pzCrust)"/>
      <circle cx="100" cy="100" r="86" fill="#E5A452"/>
      <circle cx="100" cy="100" r="83" fill="#C9432B"/>
      <circle cx="100" cy="100" r="80" fill="url(#pzCheese)"/>`;
    for (let i = 0; i < 12; i++) {
      const a = r() * 6.283, d = Math.sqrt(r()) * 66;
      s += `<ellipse cx="${(100 + Math.cos(a) * d).toFixed(1)}" cy="${(100 + Math.sin(a) * d).toFixed(1)}" rx="${(6 + r() * 9).toFixed(1)}" ry="${(4 + r() * 6).toFixed(1)}" fill="#FFF3CC" opacity=".55" transform="rotate(${(r() * 180) | 0} ${(100 + Math.cos(a) * d).toFixed(1)} ${(100 + Math.sin(a) * d).toFixed(1)})"/>`;
    }
    for (let i = 0; i < 14; i++) {
      const a = r() * 6.283, d = Math.sqrt(r()) * 74;
      s += `<circle cx="${(100 + Math.cos(a) * d).toFixed(1)}" cy="${(100 + Math.sin(a) * d).toFixed(1)}" r="${(1.5 + r() * 3).toFixed(1)}" fill="${i % 3 ? '#D98F2E' : '#C9432B'}" opacity=".45"/>`;
    }
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 4, x = Math.cos(a) * 82, y = Math.sin(a) * 82;
      s += `<line x1="${(100 - x).toFixed(1)}" y1="${(100 - y).toFixed(1)}" x2="${(100 + x).toFixed(1)}" y2="${(100 + y).toFixed(1)}" stroke="#9A5A1E" stroke-opacity=".22" stroke-width="1.3"/>`;
    }
    const uniq = [...new Set(tops)];
    const meat = uniq.filter(t => ['pepperoni', 'cheese'].includes(t));
    const rest = uniq.filter(t => !meat.includes(t));
    for (const t of [...meat, ...rest]) {
      const tr = rng(hash(seed + t));
      const n = TOP_COUNT[t] || Math.max(7, Math.round(30 / Math.max(1, uniq.length)) + 4);
      for (let i = 0; i < n; i++) {
        const a = tr() * 6.283, d = Math.sqrt(tr()) * (t === 'pepperoni' ? 62 : 70);
        s += `<g transform="translate(${(100 + Math.cos(a) * d).toFixed(1)} ${(100 + Math.sin(a) * d).toFixed(1)}) rotate(${(tr() * 360) | 0})">${TOP_SVG[t]}</g>`;
      }
    }
    return s + '</svg>';
  }

  function topIcon(t) {
    const pts = [[22, 24, 20], [40, 30, 140], [28, 41, 260]];
    return `<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="28" fill="#FBEAC4"/>${pts.map(([x, y, r]) => `<g transform="translate(${x} ${y}) scale(${t === 'pepperoni' ? 1.3 : 1.9}) rotate(${r})">${TOP_SVG[t]}</g>`).join('')}</svg>`;
  }

  function cup(color, x = 0, y = 0, sc = 1) {
    return `<g transform="translate(${x} ${y}) scale(${sc})">
      <path d="M104 16l10-10" stroke="#E31837" stroke-width="7" stroke-linecap="round"/><path d="M104 16v26" stroke="#E31837" stroke-width="7"/>
      <path d="M58 52h84l-10 128a8 8 0 01-8 7H76a8 8 0 01-8-7z" fill="${color}"/>
      <path d="M62 95h76l-2.5 34h-71z" fill="#fff" opacity=".92"/>
      <circle cx="88" cy="112" r="6" fill="#E31837"/><circle cx="104" cy="112" r="6" fill="#006491"/>
      <rect x="52" y="40" width="96" height="16" rx="7" fill="#F4F6F8" stroke="#D5DCE2" stroke-width="2"/>
      <path d="M70 60l4 110" stroke="#fff" stroke-opacity=".25" stroke-width="6" stroke-linecap="round"/></g>`;
  }

  function art(p, seed) {
    const k = p.cat === 'pizza' ? 'pizza' : p.art;
    seed = seed || p.id;
    const plate = '<ellipse cx="100" cy="150" rx="86" ry="30" fill="#fff" stroke="#E6DCCB" stroke-width="2"/>';
    switch (k) {
      case 'pizza': return pizza(p.tops, seed);
      case 'combo': return `<svg viewBox="0 0 200 200" aria-hidden="true"><g transform="translate(6 34) scale(.66)">${pizza(['pepperoni'], 'combo').replace('<svg', '<svg width="200" height="200"')}</g>${cup('#1D3E8A', 96, 40, .55)}</svg>`;
      case 'mix': return `<svg viewBox="0 0 200 200" aria-hidden="true"><g transform="translate(0 6) scale(.6)">${pizza(['pepperoni'], 'mixa').replace('<svg', '<svg width="200" height="200"')}</g><g transform="translate(68 52) scale(.6)">${pizza(['chicken', 'pepper', 'onion'], 'mixb').replace('<svg', '<svg width="200" height="200"')}</g>${wingsSvg(60, 112, .5)}</svg>`;
      case 'duo': return `<svg viewBox="0 0 200 200" aria-hidden="true"><g transform="translate(0 20) scale(.66)">${pizza(['cheese'], 'duoa').replace('<svg', '<svg width="200" height="200"')}</g><g transform="translate(66 46) scale(.66)">${pizza(['pepperoni', 'mushroom'], 'duob').replace('<svg', '<svg width="200" height="200"')}</g></svg>`;
      case 'sticks': return `<svg viewBox="0 0 200 200" aria-hidden="true">
        ${[0, 1, 2, 3, 4, 5].map(i => `<g transform="rotate(${-14 + i * 6} 100 160)"><rect x="${54 + i * 15}" y="${34 + (i % 2) * 10}" width="18" height="110" rx="9" fill="#E9AE5E" stroke="#B9762E" stroke-width="2"/><circle cx="${61 + i * 15}" cy="${56 + (i % 2) * 10}" r="1.6" fill="#4C8B2E"/><circle cx="${66 + i * 15}" cy="${76 + (i % 2) * 10}" r="1.6" fill="#4C8B2E"/></g>`).join('')}
        <path d="M40 110h120l-12 70H52z" fill="#006491"/><path d="M40 110h120l-3 16H43z" fill="#fff"/>
        <g transform="translate(100 154) rotate(-42)"><rect x="-9" y="-16" width="18" height="32" rx="4" fill="#fff"/><rect x="-7" y="-14" width="14" height="13" rx="3" fill="#E31837"/></g></svg>`;
      case 'cheesy': return `<svg viewBox="0 0 200 200" aria-hidden="true">${plate}
        <ellipse cx="100" cy="128" rx="80" ry="40" fill="#C98A42"/><ellipse cx="100" cy="120" rx="78" ry="36" fill="#EBB86E"/>
        <path d="M40 116q60-26 120 0q-6 26-60 30q-54-4-60-30z" fill="#FFE29A"/>
        ${[0, 1, 2, 3].map(i => `<path d="M${56 + i * 26} 98l10 46" stroke="#B9762E" stroke-width="3" stroke-linecap="round"/>`).join('')}
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<circle cx="${50 + i * 14}" cy="${110 + (i % 3) * 8}" r="2" fill="#4C8B2E"/>`).join('')}</svg>`;
      case 'wedges': return `<svg viewBox="0 0 200 200" aria-hidden="true">
        ${[[60, 70, -30], [84, 56, -8], [110, 58, 14], [134, 72, 32], [96, 76, 2]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-12 50L0-28L12 50Z" fill="#E8B04F" stroke="#9B5E1E" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 48L0-26" stroke="#A8662A" stroke-width="5"/><circle cx="-3" cy="10" r="1.5" fill="#C0392B"/><circle cx="1" cy="26" r="1.5" fill="#C0392B"/></g>`).join('')}
        <path d="M34 112h132l-16 66H50z" fill="#E31837"/><path d="M34 112h132l-3 14H37z" fill="#fff"/></svg>`;
      case 'wings': return `<svg viewBox="0 0 200 200" aria-hidden="true">${plate}${wingsSvg(100, 112, 1)}</svg>`;
      case 'kickers': return `<svg viewBox="0 0 200 200" aria-hidden="true">
        ${[[60, 78], [88, 64], [118, 66], [142, 82], [74, 96], [106, 90], [130, 104]].map(([x, y], i) => `<g transform="translate(${x} ${y}) rotate(${i * 37})"><path d="M-17-9Q-4-18 14-11Q22 0 13 11Q-2 18-16 9Q-23 0-17-9Z" fill="#D9963C" stroke="#9C5F1D" stroke-width="2.5"/><circle cx="-5" cy="-3" r="1.6" fill="#9C5F1D"/><circle cx="5" cy="4" r="1.6" fill="#9C5F1D"/></g>`).join('')}
        <path d="M34 112h132l-16 66H50z" fill="#006491"/><path d="M34 112h132l-3 14H37z" fill="#fff"/></svg>`;
      case 'lava': return `<svg viewBox="0 0 200 200" aria-hidden="true">${plate}
        <path d="M46 148V108a54 26 0 01108 0v40a54 14 0 01-108 0z" fill="#4A2618"/><ellipse cx="100" cy="106" rx="54" ry="22" fill="#5E3220"/>
        <path d="M84 102q16-14 32 0q-2 14 8 30q-10 4-14-10q-2 22-12 22q-6-14 0-26q-10 8-14-16z" fill="#2B1209"/>
        ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${66 + i * 11}" cy="${96 + (i % 2) * 8}" r="1.6" fill="#fff" opacity=".8"/>`).join('')}</svg>`;
      case 'brownie': return `<svg viewBox="0 0 200 200" aria-hidden="true">${plate}
        <path d="M46 98l70-24 44 28v38l-70 24-44-28z" fill="#4A2618"/><path d="M46 98l70-24 44 28-70 24z" fill="#6B3A24"/><path d="M90 126v38l70-24v-38z" fill="#3A1C10"/>
        ${[[80, 98], [104, 92], [120, 106], [96, 112]].map(([x, y]) => `<path d="M${x} ${y}l6-3 6 3-6 3z" fill="#D9B27A"/>`).join('')}</svg>`;
      case 'cup': return `<svg viewBox="0 0 200 200" aria-hidden="true">${cup(p.color || '#1D3E8A')}</svg>`;
      case 'water': return `<svg viewBox="0 0 200 200" aria-hidden="true"><rect x="86" y="12" width="28" height="18" rx="4" fill="#006491"/>
        <path d="M84 30h32v12q14 10 14 26v104a12 12 0 01-12 12H82a12 12 0 01-12-12V68q0-16 14-26z" fill="#D7EEF8" stroke="#8CC5DD" stroke-width="3"/>
        <rect x="70" y="96" width="60" height="44" fill="#fff" stroke="#8CC5DD" stroke-width="2"/><path d="M84 118h32" stroke="#006491" stroke-width="5" stroke-linecap="round"/></svg>`;
    }
    return '';
  }
  function wingsSvg(cx, cy, sc) {
    return `<g transform="translate(${cx} ${cy}) scale(${sc})">${[[-44, -6, -20], [-14, -18, 10], [18, -10, -14], [44, 2, 24], [-4, 10, 4]].map(([x, y, r]) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-6-26Q8-30 12-14Q16 6 6 24Q-2 30-10 22Q-16 2-12-14Q-12-24-6-26Z" fill="#C2441E" stroke="#7E2810" stroke-width="2.5"/><path d="M-4-16q6 10 2 28" stroke="#E57B3E" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join('')}</g>`;
  }

  // ---------- Shared pieces ----------

  const tagsFor = (p, S) => [
    p.tag === 'best' && `<span class="tag best">${T(S).best}</span>`,
    p.tag === 'new' && `<span class="tag new">${T(S).newT}</span>`,
    p.veg && `<span class="tag veg">${T(S).veg}</span>`,
    p.hot && `<span class="tag hot">${ic('flame', 20, 2.6)}${T(S).hot}</span>`,
  ].filter(Boolean).join('');

  const a11yBtn = (S, cls = 'ib') => `<button class="${cls} ${S.reach ? 'on' : ''}" data-a="a11y" aria-label="Accessible view">${ic('access', 44)}</button>`;
  const langBtn = S => `<button class="pill" data-a="lang" data-v="${S.lang === 'en' ? 'ar' : 'en'}">${ic('globe', 34)}${S.lang === 'en' ? 'العربية' : 'English'}</button>`;

  function header(S, { backTo, title } = {}) {
    const t = T(S);
    const left = backTo
      ? `<button class="pill" data-a="go" data-v="${backTo}">${ic('back', 36, 3, 'flip')}${t.back}</button>`
      : `${logo(78)}`;
    return `<header class="kh">${left}
      ${title ? `<div class="title disp">${title}</div>` : '<div class="grow"></div>'}
      ${langBtn(S)}${a11yBtn(S)}
      <button class="ib" data-a="reset" aria-label="${t.startOver}">${ic('restart', 40)}</button></header>`;
  }

  function stepper(dec, inc, n, big) {
    return `<div class="step ${big ? 'lg' : ''}"><button data-a="${dec}" aria-label="Less">${ic(n === 1 && dec.startsWith('dec') ? 'trash' : 'minus', big ? 40 : 32, 3)}</button><span class="num">${n}</span><button data-a="${inc}" aria-label="More">${ic('plus', big ? 40 : 32, 3)}</button></div>`;
  }

  // ---------- Screens ----------

  const screens = {
    attract(S) {
      const t = T(S);
      return `<div class="k attract" data-a="start" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">
        <div class="top">${logo(112)}
          <div class="langs"><button class="${S.lang === 'en' ? 'on' : ''}" data-a="lang" data-v="en">English</button><button class="${S.lang === 'ar' ? 'on' : ''}" data-a="lang" data-v="ar">العربية</button></div></div>
        <h1 class="disp">${t.hero}</h1>
        <p class="sub">${t.heroSub}</p>
        <div class="hero">${pizza(['pepperoni', 'mushroom', 'olive', 'pepper'], 'hero')}
          <div class="deal"><div>${t.dealTop}<b class="num">29</b>${S.lang === 'ar' ? 'د.إ' : 'AED'} ${t.dealBottom}</div></div></div>
        <button class="btn btn-red cta">${ic('next', 56, 3, 'flip')}${t.touch}</button>
        <div class="foot">${[['card', 0], ['tap', 1], ['tap', 2], ['cash', 3]].map(([i, n]) => `<span>${ic(i, 34)}${t.payFoot[n]}</span>`).join('')}</div>
        ${a11yBtn(S, 'ib a11y')}
      </div>`;
    },

    otype(S) {
      const t = T(S);
      return `<div class="k otype" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${header(S)}
        <div class="body">
          <h2 class="disp">${t.where}</h2><p class="lead">${t.whereLead}</p>
          <button class="choice" data-a="type" data-v="dine"><div class="art">${ic('dine', 170, 1.6)}</div>
            <div><h3 class="disp">${t.dine}</h3><p>${t.dineSub}</p></div><span class="go">${ic('next', 50, 3, 'flip')}</span></button>
          <button class="choice" data-a="type" data-v="take"><div class="art">${ic('bag', 170, 1.6)}</div>
            <div><h3 class="disp">${t.take}</h3><p>${t.takeSub}</p></div><span class="go">${ic('next', 50, 3, 'flip')}</span></button>
          <div class="bottom"><button class="btn btn-ghost sm" data-a="reset">${ic('back', 34, 3, 'flip')}${t.back}</button></div>
        </div></div>`;
    },

    menu(S) {
      const t = T(S), tot = totals(S);
      const list = MENU.filter(p => p.cat === S.cat);
      const cards = list.map(p => {
        const q = qtyOf(S, p.id), isPizza = p.cat === 'pizza';
        const price = isPizza ? `<span class="price"><small>${t.from}</small>${aed(sizePrice(p, 'S'), S)}</span>` : `<span class="price">${aed(p.price, S)}</span>`;
        const action = isPizza || q === 0
          ? `<button class="addbtn" data-a="${isPizza ? 'open' : 'add'}" data-v="${p.id}">${ic('plus', 30, 3.2)}${t.add}</button>`
          : stepper(`mdec:${p.id}`, `minc:${p.id}`, q);
        return `<article class="pc ${q ? 'in' : ''}" ${isPizza ? `data-a="open" data-v="${p.id}"` : ''}>
          ${q ? `<span class="count num">${q}</span>` : ''}
          <div class="img">${art(p)}<div class="tags">${tagsFor(p, S)}</div></div>
          <h3>${esc(name(p, S))}</h3><p class="d">${esc(desc(p, S))}</p>
          <div class="row">${price}${action}</div></article>`;
      }).join('');
      return `<div class="k menu" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">
        <header class="kh">${logo(78)}<div class="grow"></div>
          <button class="pill" data-a="toggletype">${ic(S.type === 'take' ? 'bag' : 'dine', 34)}${S.type === 'take' ? t.takeShort : t.dineShort}</button>
          ${langBtn(S)}${a11yBtn(S)}<button class="ib" data-a="reset" aria-label="${t.startOver}">${ic('restart', 40)}</button></header>
        <div class="promo"><div class="t"><small>${t.promoTag}</small><div class="disp">${t.promo}</div></div>
          <button class="btn btn-white" data-a="cat" data-v="deals">${t.promoBtn}</button>${pizza(['pepperoni', 'pepper'], 'promo')}</div>
        <div class="mbody">
          <nav class="rail" data-sk="rail">${CATS.map(c => `<button class="${S.cat === c ? 'on' : ''}" data-a="cat" data-v="${c}"><span class="ri">${c === 'pizza' ? pizza(['pepperoni'], 'rail') : art(MENU.find(p => p.art === CAT_ART[c] || (c === 'drinks' && p.cat === 'drinks')))}</span>${t.cats[c]}</button>`).join('')}</nav>
          <section class="items" data-sk="items-${S.cat}"><h2 class="disp">${t.cats[S.cat]}<small>${t.itemsCount(list.length)}</small></h2><div class="cards">${cards}</div></section>
        </div>
        <footer class="cartbar">
          <div class="bag">${ic('bag', 56, 2.2)}${tot.count ? `<b class="num">${tot.count}</b>` : ''}</div>
          ${tot.count ? `<div class="sum"><div>${t.items(tot.count)}</div><strong class="num">${aed(tot.total, S)}</strong></div>` : `<div class="empty">${t.emptyCart}</div>`}
          <button class="btn btn-red" data-a="go" data-v="cart" ${tot.count ? '' : 'disabled'}>${t.review}${ic('next', 40, 3, 'flip')}</button>
        </footer></div>`;
    },

    custom(S) {
      const t = T(S), c = S.custom, p = BY_ID[c.pid];
      const item = { pid: c.pid, size: c.size, crust: c.crust, extras: c.extras, qty: c.qty };
      const scale = { S: .74, M: .87, L: 1 }[c.size];
      const extrasAllowed = TOPPINGS.filter(tp => !(p.veg && ['pepperoni', 'chicken', 'sausage'].includes(tp.id)));
      return `<div class="k custom" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: c.editIdx != null ? 'cart' : 'menu', title: t.customise })}
        <div class="chero"><div class="pzbox">${pizza([...p.tops, ...c.extras], p.id, `style="transform:scale(${scale})"`)}</div>
          <div><div class="tags">${tagsFor(p, S)}</div><h2 class="disp">${esc(name(p, S))}</h2><p>${esc(desc(p, S))}</p></div></div>
        <div class="cpanel" data-sk="cpanel">
          <section><h3 class="disp">${t.size}</h3><div class="opts c3">${['S', 'M', 'L'].map((z, i) => `
            <button class="opt size ${c.size === z ? 'on' : ''}" data-a="size" data-v="${z}"><span class="ck">${ic('check', 28, 3.4)}</span>
              <i style="width:${SIZES[z].ring}px;height:${SIZES[z].ring}px;margin:${(122 - SIZES[z].ring) / 2}px 0 ${(122 - SIZES[z].ring) / 2 + 10}px"></i><b>${t.sizes[z]}</b><span>${t.serves[i]}</span><em class="num">${aed(sizePrice(p, z), S)}</em></button>`).join('')}</div></section>
          <section><h3 class="disp">${t.crust}</h3><div class="opts c2">${CRUSTS.map(cr => `
            <button class="opt ${c.crust === cr.id ? 'on' : ''}" data-a="crust" data-v="${cr.id}"><span class="ck">${ic('check', 28, 3.4)}</span>
              <b>${cr[S.lang][0]}</b><span>${cr[S.lang][1]}</span><em class="num">${cr.add ? `+ ${aed(cr.add, S)}` : '&nbsp;'}</em></button>`).join('')}</div></section>
          <section><h3 class="disp">${t.extras}<small>${t.extrasHint} · + ${aed(EXTRA_PRICE[c.size], S)}</small></h3><div class="opts c4">${extrasAllowed.map(tp => `
            <button class="opt top ${c.extras.includes(tp.id) ? 'on' : ''}" data-a="extra" data-v="${tp.id}"><span class="ck">${ic('check', 28, 3.4)}</span>
              ${topIcon(tp.id)}<b>${tp[S.lang]}</b></button>`).join('')}</div></section>
        </div>
        <footer class="cfoot">${stepper('cdec', 'cinc', c.qty, true)}
          <button class="btn btn-red" data-a="addcustom">${c.editIdx != null ? t.update : t.addToOrder} · <span class="num">${aed(unitPrice(item) * c.qty, S)}</span></button></footer></div>`;
    },

    cart(S) {
      const t = T(S), tot = totals(S);
      const lines = S.cart.map((it, i) => {
        const p = BY_ID[it.pid];
        let meta = '';
        if (p.cat === 'pizza') {
          meta = `<span>${t.sizes[it.size]} · ${CRUST[it.crust][S.lang][0]}</span>`;
          if (it.extras.length) meta += `<span>+ ${it.extras.map(e => TOP_NAME[e][S.lang]).join(S.lang === 'ar' ? '، ' : ', ')}</span>`;
          meta += `<button class="edit" data-a="edit" data-v="${i}">${ic('edit', 28, 2.6)}${t.edit}</button>`;
        } else meta = `<span>${esc(desc(p, S))}</span>`;
        return `<div class="line"><div class="th">${art(p)}</div><div class="info"><b>${esc(name(p, S))}</b>${meta}</div>
          ${stepper(`dec:${i}`, `inc:${i}`, it.qty)}<div class="lp num">${aed(unitPrice(it) * it.qty, S)}</div></div>`;
      }).join('');
      const ups = ['wings', 'lava', 'cola', 'garlic', 'wedges'].filter(id => !qtyOf(S, id) || S.upsold.includes(id)).slice(0, 3);
      return `<div class="k cart" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: 'menu', title: t.yourOrder })}
        <div class="cbody" data-sk="cart">
          <div class="ctype">${ic(S.type === 'take' ? 'bag' : 'dine', 36)}${t.orderFor}: <b>${S.type === 'take' ? t.takeShort : t.dineShort}</b>
            <button class="edit" style="margin-inline-start:auto;color:var(--blue);font-weight:700;display:inline-flex;gap:8px;align-items:center" data-a="toggletype">${ic('edit', 28, 2.6)}${t.edit}</button></div>
          <div class="lines">${lines}</div>
          <section class="sect"><h3 class="disp">${t.complete}</h3><div class="ups">${ups.map(id => {
            const p = BY_ID[id], on = qtyOf(S, id) > 0;
            return `<div class="up ${on ? 'added' : ''}"><div class="img">${art(p)}</div><b>${esc(name(p, S))}</b><span class="num">${aed(p.price, S)}</span>
              <button class="addbtn" data-a="${on ? 'noop' : 'upsell'}" data-v="${id}">${ic(on ? 'check' : 'plus', 30, 3.2)}${on ? t.added : t.add}</button></div>`;
          }).join('')}</div></section>
          <button class="coupon ${S.coupon ? 'on' : ''}" data-a="coupon"><span class="ci">${ic(S.coupon ? 'check' : 'tag', 44, 2.6)}</span>
            <div><b>${S.coupon ? t.couponOnT : t.couponT}</b><span>${S.coupon ? t.couponOnS : t.couponS}</span></div>
            <span class="act">${S.coupon ? t.remove : t.apply}</span></button>
          <div class="totals"><div><span>${t.subtotal}</span><span class="num">${aed(tot.sub, S)}</span></div>
            ${tot.disc ? `<div class="disc"><span>${t.discount}</span><span class="num">− ${aed(tot.disc, S)}</span></div>` : ''}
            <div><span>${t.vat}</span><span class="num">${aed(tot.vat, S)}</span></div>
            <div class="grand"><span>${t.total}</span><span class="num">${aed(tot.total, S)}</span></div></div>
        </div>
        <footer class="cfoot"><button class="btn btn-ghost" style="flex:0 0 auto" data-a="go" data-v="menu">${ic('plus', 36, 3)}${t.addMore}</button>
          <button class="btn btn-red" data-a="go" data-v="pay">${t.toPay} · <span class="num">${aed(tot.total, S)}</span></button></footer></div>`;
    },

    pay(S) {
      const t = T(S), tot = totals(S);
      let detail;
      if (S.pay === 'tap') {
        detail = `<div class="tapart">${ic('tap', 220, 1.6)}</div><h3 class="disp">${t.tapNow}</h3><span class="down">${ic('down', 80, 3)}</span>
          <span class="wait"><i class="spin"></i>${t.waiting}</span><button class="demo" data-a="paid">${t.simulate}</button>`;
      } else if (S.pay === 'counter') {
        detail = `${ic('receipt', 200, 1.4)}<h3 class="disp">${t.counterNow}</h3><p>${t.counterP}</p>
          <button class="btn btn-red" data-a="paid" data-v="counter">${ic('receipt', 40, 2.6)}${t.print}</button>`;
      } else {
        detail = `<span style="color:var(--blue)">${ic('card', 160, 1.4)}</span><h3 class="disp">${t.choose}</h3><p>${t.chooseS}</p>`;
      }
      return `<div class="k pay" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: 'cart', title: t.payment })}
        <div class="pbody">
          <div class="amount"><small>${t.amountToPay}</small><div class="disp num">${aed(tot.total, S)}</div><span>${t.inclVat}</span></div>
          <div class="methods">
            <button class="method ${S.pay === 'tap' ? 'on' : ''}" data-a="paym" data-v="tap"><span class="mi">${ic('tap', 52, 2.4)}</span><b>${t.tapT}</b><span>${t.tapS}</span>
              <div class="wallets"><i>Visa</i><i>Mastercard</i><i>Apple Pay</i><i>Google Pay</i></div></button>
            <button class="method ${S.pay === 'counter' ? 'on' : ''}" data-a="paym" data-v="counter"><span class="mi">${ic('cash', 52, 2.4)}</span><b>${t.counterT}</b><span>${t.counterS}</span></button>
          </div>
          <div class="pdetail">${detail}</div>
        </div></div>`;
    },

    confirm(S) {
      const t = T(S), tot = totals(S);
      return `<div class="k confirm" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">
        <div class="ctop"><div class="okc">${ic('check', 120, 3)}</div><h2 class="disp">${t.placed}</h2>
          <p>${S.paid ? t.paidVia : t.payAtCounter} · <span class="num">${aed(tot.total, S)}</span></p></div>
        <div class="ticket"><small>${t.orderNo}</small><div class="no disp num">${S.orderNo}</div>
          <div class="meta">${S.type === 'take' ? t.takeShort : t.dineShort} · ${t.items(tot.count)}</div></div>
        <div class="track">${t.track.map((s, i) => `<div class="${i === 0 ? 'done' : i === 1 && S.paid ? 'now' : ''}"><i>${ic(['check', 'clock', 'oven', 'bag'][i], 36, 2.8)}</i>${s}</div>`).join('')}</div>
        <p class="cmsg">${S.type === 'take' ? t.takeMsg : t.dineMsg}</p>
        <div class="rate"><span>${t.rate}</span><div>${[1, 2, 3, 4, 5].map(n => `<button class="${n <= S.rating ? 'on' : ''}" data-a="rate" data-v="${n}" aria-label="${n}">${ic('star', 64, 2)}</button>`).join('')}</div></div>
        <div class="cbtm"><span class="rc">${ic('down', 34, 3)}${t.receipt}</span>
          <button class="btn btn-red" data-a="reset">${t.done}</button><small data-count="confirm">${t.newIn(S.cCount)}</small></div></div>`;
    },
  };

  function overlays(S) {
    const t = T(S);
    let s = '';
    if (S.reach) s += `<div class="reachtop" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${logo(96)}<p>${t.reachP}</p>
      <button class="btn btn-white sm" data-a="a11y">${ic('access', 36)}${t.reachOff}</button></div>`;
    if (S.timeout) {
      const c = 2 * Math.PI * 96;
      s += `<div class="modal" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}"><div class="box">
        <div class="ring"><svg width="220" height="220" viewBox="0 0 220 220"><circle cx="110" cy="110" r="96" fill="none" stroke="#F0F3F6" stroke-width="14"/>
          <circle data-ring cx="110" cy="110" r="96" fill="none" stroke="#E31837" stroke-width="14" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - S.tCount / 20)).toFixed(1)}" style="transition:stroke-dashoffset 1s linear"/></svg>
          <b data-count="t">${S.tCount}</b></div>
        <h3 class="disp">${t.still}</h3><p data-count="tp">${t.stillP(S.tCount)}</p>
        <div class="acts"><button class="btn btn-ghost" data-a="reset">${t.startOver}</button><button class="btn btn-red" data-a="stay">${t.stay}</button></div></div></div>`;
    }
    return s;
  }

  function renderKiosk(S, opts = {}) {
    return `<div class="kw ${S.reach ? 'reach' : ''} ${opts.static ? 'static' : ''}">${screens[S.screen](S)}${overlays(S)}</div>`;
  }

  // ---------- State ----------

  const fresh = () => ({ screen: 'attract', lang: 'en', type: 'dine', cat: 'pizza', cart: [], custom: null, pay: null,
    coupon: false, upsold: [], rating: 0, orderNo: 0, paid: true, reach: false, timeout: false, tCount: 20, cCount: 20 });

  const DEMO_CART = [
    { pid: 'tikka', size: 'L', crust: 'cheesy', extras: ['jalapeno', 'mushroom'], qty: 1 },
    { pid: 'margherita', size: 'M', crust: 'hand', extras: [], qty: 1 },
    { pid: 'wings', qty: 1 }, { pid: 'cola', qty: 2 },
  ];
  const demo = o => Object.assign(fresh(), { cart: DEMO_CART.map(i => ({ ...i, extras: i.extras ? [...i.extras] : undefined })), orderNo: 247 }, o);

  const BOARD = [
    { key: 'attract', title: 'Attract loop', note: 'Idle screen seen from across the store. Slowly spinning pizza, today’s deal and one huge call to action. Tap anywhere to start.', s: () => fresh() },
    { key: 'attract-ar', title: 'Attract · Arabic', note: 'Full right-to-left layout with Arabic type (Cairo). Language can be switched from any screen.', s: () => Object.assign(fresh(), { lang: 'ar' }) },
    { key: 'otype', title: 'Eat in or take away', note: 'One question per screen with two large cards. Packaging and tax rules follow this choice.', s: () => Object.assign(fresh(), { screen: 'otype' }) },
    { key: 'menu-empty', title: 'Menu · empty order', note: 'Category rail on the left, two-column cards, a deal banner and an order bar that stays put. Review stays disabled until something is added.', s: () => Object.assign(fresh(), { screen: 'menu' }) },
    { key: 'menu', title: 'Menu · items added', note: 'Items already in the order get a red outline and a count. Sides and drinks switch to an inline stepper, so no extra screen is needed.', s: () => demo({ screen: 'menu', cat: 'sides' }) },
    { key: 'custom', title: 'Build your pizza', note: 'Live preview: toppings appear on the pizza and it grows with the size. The price updates in the button.', s: () => demo({ screen: 'custom', custom: { pid: 'tikka', size: 'L', crust: 'cheesy', extras: ['jalapeno', 'mushroom'], qty: 1, editIdx: null } }) },
    { key: 'cart', title: 'Review order', note: 'Edit or change quantity on each line. A one-tap add-on row raises order value. Coupons can be scanned with the hardware scanner. VAT is shown as included.', s: () => demo({ screen: 'cart', coupon: true }) },
    { key: 'pay', title: 'Payment · choose', note: 'Two clear choices: tap to pay with a card or phone, or pay at the counter. The total stays big and on screen.', s: () => demo({ screen: 'pay', coupon: true }) },
    { key: 'pay-tap', title: 'Payment · tap card', note: 'Points to the physical reader below the screen. The kiosk moves on by itself once the terminal confirms payment.', s: () => demo({ screen: 'pay', pay: 'tap', coupon: true }) },
    { key: 'confirm', title: 'Order confirmed', note: 'A huge order number that matches the pickup screen, a progress tracker and a receipt prompt. Returns to the attract loop by itself.', s: () => demo({ screen: 'confirm', coupon: true }) },
    { key: 'timeout', title: 'Still there?', note: 'After 45 seconds with no touch, a 20-second countdown runs before the order is cleared for the next guest.', s: () => demo({ screen: 'menu', timeout: true, tCount: 14 }) },
    { key: 'reach', title: 'Accessible view', note: 'Accessibility button on every screen: the UI drops into the lower half so it is in reach from a wheelchair.', s: () => demo({ screen: 'menu', reach: true, cat: 'pizza' }) },
  ];
  const BOARD_BY_KEY = Object.fromEntries(BOARD.map(b => [b.key, b]));

  const NOTES = {
    attract: ['Readable from 3 m away: 150 px headline, a 180 px tall call to action and a pulsing ring.', 'Tap anywhere to start. Language buttons sit top right and the accessibility button bottom left.', 'Payment methods in the footer answer “do they take cards?” before the guest walks over.'],
    otype: ['One decision per screen, with 560 px tall cards.', 'The choice changes packaging and can be edited later from the menu header or order review.'],
    menu: ['Touch targets are at least 80 px (the guideline minimum is 44 pt).', 'Pizzas open the builder. Sides, desserts and drinks add inline with a stepper.', 'The order bar stays fixed. Review stays disabled until the order has an item.', 'The deal banner links to the Deals category; the offer is pulled live from the store.'],
    custom: ['Toppings appear on the preview as they are picked, and size scales the pizza.', 'Meat toppings are hidden on vegetarian pizzas.', 'The price in the button always shows the live total for the item.'],
    cart: ['Each line can be edited, changed in quantity or removed (minus at 1 becomes a bin).', 'The add-on row hides anything already in the order.', 'UAE prices include VAT, so VAT is shown as part of the total, not added on top.'],
    pay: ['Card terminal integration: Visa, Mastercard, Apple Pay and Google Pay over NFC.', 'An arrow points to the physical reader. The screen moves on by itself when payment confirms.', 'Pay at counter prints a ticket and holds the order until it is paid.'],
    confirm: ['The order number matches the pickup board in store.', 'The receipt prints from the slot below the screen.', 'Returns to the attract loop after 20 seconds, or on Done.'],
  };

  // ---------- Prototype controller ----------

  let S = fresh();
  let idle = 0;
  const frame = document.getElementById('screen');
  const device = document.getElementById('device');
  const toastEl = document.createElement('div');

  function toast(text) {
    toastEl.innerHTML = `<i>${ic('check', 32, 3.4)}</i>${esc(text)}`;
    toastEl.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => toastEl.classList.remove('show'), 1600);
  }

  let lastScreen = null;
  function render() {
    const scroll = {};
    frame.querySelectorAll('[data-sk]').forEach(el => { scroll[el.dataset.sk] = el.scrollTop; });
    frame.innerHTML = renderKiosk(S);
    toastEl.className = 'toast';
    frame.appendChild(toastEl);
    if (lastScreen === S.screen) {
      frame.querySelector('.k').style.animation = 'none';
      frame.querySelectorAll('[data-sk]').forEach(el => { if (scroll[el.dataset.sk] != null) el.scrollTop = scroll[el.dataset.sk]; });
    }
    lastScreen = S.screen;
    device.classList.toggle('printing', S.screen === 'confirm');
    updateSide();
  }

  function go(screen) {
    S.screen = screen;
    if (screen === 'pay') S.pay = null;
    if (screen === 'menu') S.custom = null;
  }

  function placeOrder(paid) {
    S.paid = paid;
    S.orderNo = 100 + Math.floor(Math.random() * 900);
    S.cCount = 20;
    go('confirm');
  }

  function act(a, v) {
    const t = T(S);
    const [cmd, arg] = a.includes(':') ? a.split(':') : [a, v];
    switch (cmd) {
      case 'start': go('otype'); break;
      case 'lang': S.lang = arg; break;
      case 'a11y': S.reach = !S.reach; break;
      case 'reset': S = fresh(); break;
      case 'stay': S.timeout = false; break;
      case 'type': S.type = arg; go('menu'); break;
      case 'toggletype': S.type = S.type === 'dine' ? 'take' : 'dine'; break;
      case 'go': go(arg); break;
      case 'cat': S.cat = arg; break;
      case 'open': S.custom = { pid: arg, size: 'M', crust: 'hand', extras: [], qty: 1, editIdx: null }; go('custom'); break;
      case 'add': S.cart.push({ pid: arg, qty: 1 }); toast(t.toast(name(BY_ID[arg], S))); break;
      case 'upsell': S.cart.push({ pid: arg, qty: 1 }); S.upsold.push(arg); toast(t.toast(name(BY_ID[arg], S))); break;
      case 'minc': { const it = S.cart.find(i => i.pid === arg); it.qty++; break; }
      case 'mdec': { const i = S.cart.findIndex(x => x.pid === arg); if (--S.cart[i].qty <= 0) S.cart.splice(i, 1); break; }
      case 'inc': S.cart[+arg].qty++; break;
      case 'dec': if (--S.cart[+arg].qty <= 0) S.cart.splice(+arg, 1); if (!S.cart.length) go('menu'); break;
      case 'edit': { const it = S.cart[+arg]; S.custom = { pid: it.pid, size: it.size, crust: it.crust, extras: [...it.extras], qty: it.qty, editIdx: +arg }; go('custom'); break; }
      case 'size': S.custom.size = arg; break;
      case 'crust': S.custom.crust = arg; break;
      case 'extra': { const e = S.custom.extras; const i = e.indexOf(arg); i < 0 ? e.push(arg) : e.splice(i, 1); break; }
      case 'cinc': S.custom.qty = Math.min(20, S.custom.qty + 1); break;
      case 'cdec': S.custom.qty = Math.max(1, S.custom.qty - 1); break;
      case 'addcustom': {
        const c = S.custom, item = { pid: c.pid, size: c.size, crust: c.crust, extras: [...c.extras], qty: c.qty };
        if (c.editIdx != null) { S.cart[c.editIdx] = item; go('cart'); }
        else { S.cart.push(item); go('menu'); toast(t.toast(name(BY_ID[c.pid], S))); }
        break;
      }
      case 'coupon': S.coupon = !S.coupon; break;
      case 'rate': S.rating = +arg; break;
      case 'paym': S.pay = arg; S.payWait = 6; break;
      case 'paid': placeOrder(arg !== 'counter'); break;
      default: return;
    }
    render();
  }

  frame.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (!el || !frame.contains(el) || el.disabled) return;
    e.stopPropagation();
    act(el.dataset.a, el.dataset.v);
  });
  frame.addEventListener('pointerdown', () => { idle = 0; });

  setInterval(() => {
    if (document.hidden || !document.querySelector('.proto').classList.contains('on')) return;
    idle++;
    if (S.timeout) {
      S.tCount--;
      if (S.tCount <= 0) { S = fresh(); render(); return; }
      const c = 2 * Math.PI * 96;
      frame.querySelector('[data-count="t"]').textContent = S.tCount;
      frame.querySelector('[data-count="tp"]').textContent = T(S).stillP(S.tCount);
      frame.querySelector('[data-ring]').setAttribute('stroke-dashoffset', (c * (1 - S.tCount / 20)).toFixed(1));
    } else if (['otype', 'menu', 'custom', 'cart', 'pay'].includes(S.screen) && idle >= 45) {
      S.timeout = true; S.tCount = 20; render();
    }
    if (S.screen === 'confirm') {
      S.cCount--;
      if (S.cCount <= 0) { S = fresh(); render(); return; }
      const el = frame.querySelector('[data-count="confirm"]');
      if (el) el.textContent = T(S).newIn(S.cCount);
    }
    if (S.screen === 'pay' && S.pay === 'tap' && --S.payWait <= 0) placeOrder(true), render();
  }, 1000);

  // ---------- Viewer: side panel, scaling, board ----------

  const FLOW = [['attract', 'Attract loop'], ['otype', 'Eat in or take away'], ['menu', 'Menu'], ['custom', 'Build your pizza'], ['cart', 'Review order'], ['pay', 'Payment'], ['confirm', 'Order confirmed']];
  const FLOW_STATE = { attract: 'attract', otype: 'otype', menu: 'menu', custom: 'custom', cart: 'cart', pay: 'pay', confirm: 'confirm' };

  function updateSide() {
    const flow = document.getElementById('flow');
    flow.innerHTML = FLOW.map(([k, label], i) => `<button class="${S.screen === k ? 'on' : ''}" data-jump="${FLOW_STATE[k]}"><span>${i + 1}</span>${label}</button>`).join('')
      + `<button data-jump="timeout"><span>·</span>Still there? prompt</button><button data-jump="attract-ar"><span>·</span>Arabic (RTL)</button>`;
    document.getElementById('notes').innerHTML = `<ul>${(NOTES[S.screen] || []).map(n => `<li>${n}</li>`).join('')}</ul>`;
  }
  document.getElementById('flow').addEventListener('click', e => {
    const b = e.target.closest('[data-jump]');
    if (b) jump(b.dataset.jump);
  });

  function jump(key) {
    S = BOARD_BY_KEY[key].s();
    if (S.screen === 'confirm') S.cCount = 20;
    idle = 0;
    lastScreen = null;
    render();
    showView('proto');
  }

  function fitDevice() {
    const box = document.getElementById('device-box');
    const w = device.offsetWidth, h = device.offsetHeight;
    const side = window.innerWidth > 1100 ? 372 : 0;
    const sc = Math.min((window.innerHeight - 64 - 48) / h, (window.innerWidth - 32 - side) / w, 1);
    device.style.transform = `scale(${sc})`;
    box.style.width = `${w * sc}px`;
    box.style.height = `${h * sc}px`;
  }

  function buildBoard() {
    const grid = document.getElementById('grid');
    const tw = Math.min(330, window.innerWidth - 48);
    grid.style.setProperty('--tw', `${tw}px`);
    // A div, not a button: the screens inside contain buttons, which can't nest.
    grid.innerHTML = BOARD.map((b, i) => `<div class="card" role="button" tabindex="0" data-open="${b.key}">
      <div class="thumb"><div class="screen-static" style="transform:scale(${tw / 1080})">${renderKiosk(b.s(), { static: true })}</div></div>
      <div class="cap"><span>${String(i + 1).padStart(2, '0')}</span><b>${b.title}</b></div><p>${b.note}</p></div>`).join('');
  }
  document.getElementById('grid').addEventListener('click', e => {
    const c = e.target.closest('[data-open]');
    if (c) jump(c.dataset.open);
  });
  document.getElementById('grid').addEventListener('keydown', e => {
    const c = e.target.closest('[data-open]');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); jump(c.dataset.open); }
  });

  function showView(v) {
    document.querySelectorAll('.view').forEach(el => el.classList.toggle('on', el.dataset.view === v));
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === v));
    if (v === 'board' && !document.getElementById('grid').children.length) buildBoard();
    if (v === 'proto') fitDevice();
    try { localStorage.setItem('kiosk-view', v); } catch (e) { /* storage unavailable */ }
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => showView(b.dataset.tab)));
  document.getElementById('restart').addEventListener('click', () => { S = fresh(); lastScreen = null; render(); showView('proto'); });

  let rT;
  window.addEventListener('resize', () => {
    fitDevice();
    clearTimeout(rT);
    rT = setTimeout(() => { if (document.getElementById('grid').children.length) buildBoard(); }, 200);
  });

  render();
  let start = 'proto';
  try { start = localStorage.getItem('kiosk-view') || 'proto'; } catch (e) { /* storage unavailable */ }
  const hash0 = location.hash.slice(1);
  if (hash0 === 'board' || hash0 === 'proto') start = hash0;
  else if (BOARD_BY_KEY[hash0]) { jump(hash0); start = null; }
  if (start) showView(start);
  window.addEventListener('hashchange', () => { const k = location.hash.slice(1); if (BOARD_BY_KEY[k]) jump(k); else if (k === 'board' || k === 'proto') showView(k); });
  if (document.fonts) document.fonts.ready.then(fitDevice);
})();
