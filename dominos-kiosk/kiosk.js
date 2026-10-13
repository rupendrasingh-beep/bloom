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
      kcalUnit: 'kcal', kcalSlice: k => `${k} kcal / slice`, kcalEach: k => `${k} kcal`, kcalWhole: k => `${k} kcal whole pizza`,
      energyTotal: 'Energy, whole order', kcalAdult: 'Adults need around 2,000 kcal a day.',
      contains: 'Contains', may: 'May contain', noAllergens: 'No major allergens',
      nutrition: 'Nutrition', perSlice: 'per slice, Medium', perServing: 'per serving',
      nut: ['Energy', 'Protein', 'Carbs', 'Sugars', 'Fat', 'Salt'],
      avIn: m => `Available · ready in ${m} min`, avNow: 'Available · ready now', avLow: n => `Only ${n} left today`,
      avOut: 'Sold out today · back tomorrow', avLater: h => `Available from ${h}`, soldOut: 'Sold out', fromTime: h => `From ${h}`,
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
      kcalUnit: 'سعرة', kcalSlice: k => `${k} سعرة / شريحة`, kcalEach: k => `${k} سعرة`, kcalWhole: k => `${k} سعرة للبيتزا كاملة`,
      energyTotal: 'الطاقة، الطلب كاملاً', kcalAdult: 'يحتاج البالغ إلى نحو ٢٠٠٠ سعرة حرارية يومياً.',
      contains: 'يحتوي على', may: 'قد يحتوي على', noAllergens: 'خالٍ من مسببات الحساسية الرئيسية',
      nutrition: 'القيم الغذائية', perSlice: 'للشريحة، حجم وسط', perServing: 'للحصة',
      nut: ['الطاقة', 'بروتين', 'كربوهيدرات', 'سكريات', 'دهون', 'ملح'],
      avIn: m => `متوفر · جاهز خلال ${m} دقيقة`, avNow: 'متوفر · جاهز الآن', avLow: n => `متبقٍ ${n} فقط اليوم`,
      avOut: 'نفد اليوم · يعود غداً', avLater: h => `متوفر من الساعة ${h}`, soldOut: 'نفد', fromTime: h => `من ${h}`,
    },
  };

  Object.assign(COPY.en, {
    store: 'Al Barsha South, Dubai', storeMenu: 'UAE menu · prices include VAT',
    pubTitle: 'Coupons for everyone', pubTap: 'Tap to save', pubSaved: 'Saved',
    savedToast: 'Coupon saved. Sign in at checkout to use it.',
    hi: n => `Hi ${n}`, signOut: 'Sign out', signIn: 'Sign in', walletBal: 'Wallet',
    style: 'Pizza style', whole: 'Whole pizza', halfHalf: 'Half & half', otherHalf: 'Choose the other half',
    hhNote: 'Two pizzas on one base. Charged at the price of the higher half.', mlOnly: 'Medium & Large only',
    noHalfSmall: 'Not for half & half', noCheesySmall: 'Not with Cheesy Crust',
    removeT: 'Remove ingredients', removeHint: 'Tap anything you’d like left off', no: x => `No ${x.toLowerCase()}`,
    maxExtras: n => `Up to ${n}`, maxReached: 'You’ve reached the maximum of 5 extra toppings.',
    halfOf: (a, b) => `${a} / ${b}`,
    upTitle: 'Make it Large?', upSub: d => `About 40% more pizza for just + ${d}`, upYes: d => `Upgrade to Large · + ${d}`, upDone: 'Upgraded to Large',
    goesWith: 'Goes great with', cont: 'Continue',
    dealBuild: 'Build your deal', choose: 'Choose', change: 'Change', chooseLeft: n => `Choose ${n} more item${n === 1 ? '' : 's'}`,
    addDeal: 'Add deal', updateDeal: 'Update deal', slotPizza: n => `Pizza ${n}`, slotSide: 'Side', slotDrink: 'Drink', slotIncluded: 'Included',
    medium: 'Medium', crustFor: 'Crust for this pizza', premium: v => `+ ${v}`, handOnly: 'Hand Tossed only in this deal',
    signInT: 'Sign in with your mobile number', whyCoupon: 'Sign in to use your coupons.', whyWallet: 'Sign in to use your Domino’s wallet.',
    whyLogin: 'See your wallet balance and personal coupons.', sendCode: 'Send code', guest: 'Continue as guest',
    privacy: 'We only use your number to find your wallet and coupons. You’re signed out automatically when your order is done.',
    otpT: 'Enter your code', otpS: p => `We sent a 4-digit code to ${p}`, otpDemo: 'Demo code: 1234',
    otpErr: n => `That code doesn’t match. ${n} ${n === 1 ? 'try' : 'tries'} left.`, resend: s => `Resend code in 0:${String(s).padStart(2, '0')}`,
    resendNow: 'Resend code', changeNo: 'Change number', welcome: n => `Welcome back, ${n}`, tooMany: 'Too many attempts. You can continue as a guest.',
    signInBanner: 'Have a wallet or coupons?', signInBannerS: 'Sign in with your mobile number to use them, or just continue as a guest.',
    savedCoupon: id => `Coupon ${id} saved. Sign in to redeem it.`,
    walletT: 'Domino’s wallet', balance: v => `Balance ${v}`, useNone: 'Don’t use', useSome: v => `Use ${v}`, useAll: 'Pay it all',
    walletApplied: 'Paid from wallet', toPayCard: 'Left to pay',
    couponsT: 'Your coupons', applyC: 'Apply', removeC: 'Remove', minOrder: v => `Spend ${v} or more to use this`,
    needItem: n => `Add ${n} to use this`, deliveryOnly: 'Valid on delivery orders only', couponLbl: c => `Coupon ${c}`,
    payWalletT: 'Your wallet covers this order', payWalletS: 'Confirm to pay the full amount from your wallet.', payWalletBtn: 'Pay with wallet',
    walletHeld: v => `${v} from your wallet is held for this order`, notWithWallet: 'Not available with wallet',
    failT: 'Payment didn’t go through', failS: 'Your card was declined. Nothing was charged.', released: v => `Your wallet hold of ${v} has been released.`,
    retry: 'Try again', simulateFail: 'Simulate a declined card',
    paidSplit: (w, c) => `Paid ${w} from wallet + ${c} by card`, paidWallet: v => `Paid ${v} from your wallet`,
    signedOut: 'For your privacy, you’ve been signed out.', fusion: 'Fusion Pay',
  });
  Object.assign(COPY.ar, {
    store: 'البرشاء جنوب، دبي', storeMenu: 'قائمة الإمارات · الأسعار شاملة الضريبة',
    pubTitle: 'قسائم للجميع', pubTap: 'المس للحفظ', pubSaved: 'تم الحفظ',
    savedToast: 'تم حفظ القسيمة. سجّل الدخول عند الدفع لاستخدامها.',
    hi: n => `مرحباً ${n}`, signOut: 'تسجيل الخروج', signIn: 'تسجيل الدخول', walletBal: 'المحفظة',
    style: 'نوع البيتزا', whole: 'بيتزا كاملة', halfHalf: 'نصف ونصف', otherHalf: 'اختر النصف الآخر',
    hhNote: 'بيتزتان على عجينة واحدة. يُحتسب السعر حسب النصف الأعلى سعراً.', mlOnly: 'للوسط والكبير فقط',
    noHalfSmall: 'غير متاح لنصف ونصف', noCheesySmall: 'غير متاح مع حواف بالجبن',
    removeT: 'إزالة مكونات', removeHint: 'المس أي مكوّن تريد إزالته', no: x => `بدون ${x}`,
    maxExtras: n => `حتى ${n}`, maxReached: 'وصلت إلى الحد الأقصى وهو ٥ إضافات.',
    halfOf: (a, b) => `${a} / ${b}`,
    upTitle: 'هل تريدها كبيرة؟', upSub: d => `بيتزا أكبر بنحو ٤٠٪ مقابل ${d} فقط`, upYes: d => `ترقية إلى كبير · ${d}+`, upDone: 'تمت الترقية إلى كبير',
    goesWith: 'يُقدَّم عادةً مع', cont: 'متابعة',
    dealBuild: 'كوّن عرضك', choose: 'اختر', change: 'تغيير', chooseLeft: n => `اختر ${n} صنف إضافي`,
    addDeal: 'أضف العرض', updateDeal: 'تحديث العرض', slotPizza: n => `البيتزا ${n}`, slotSide: 'المقبلات', slotDrink: 'المشروب', slotIncluded: 'مشمول',
    medium: 'وسط', crustFor: 'عجينة هذه البيتزا', premium: v => `${v}+`, handOnly: 'العجينة اليدوية فقط في هذا العرض',
    signInT: 'سجّل الدخول برقم هاتفك', whyCoupon: 'سجّل الدخول لاستخدام قسائمك.', whyWallet: 'سجّل الدخول لاستخدام محفظة دومينوز.',
    whyLogin: 'اطّلع على رصيد محفظتك وقسائمك الخاصة.', sendCode: 'إرسال الرمز', guest: 'المتابعة كضيف',
    privacy: 'نستخدم رقمك فقط للعثور على محفظتك وقسائمك. يتم تسجيل خروجك تلقائياً عند انتهاء طلبك.',
    otpT: 'أدخل الرمز', otpS: p => `أرسلنا رمزاً من ٤ أرقام إلى ${p}`, otpDemo: 'الرمز التجريبي: 1234',
    otpErr: n => `الرمز غير صحيح. متبقٍ ${n} محاولات.`, resend: s => `إعادة الإرسال خلال 0:${String(s).padStart(2, '0')}`,
    resendNow: 'إعادة إرسال الرمز', changeNo: 'تغيير الرقم', welcome: n => `أهلاً بعودتك يا ${n}`, tooMany: 'محاولات كثيرة. يمكنك المتابعة كضيف.',
    signInBanner: 'لديك محفظة أو قسائم؟', signInBannerS: 'سجّل الدخول برقم هاتفك لاستخدامها، أو تابع كضيف.',
    savedCoupon: id => `القسيمة ${id} محفوظة. سجّل الدخول لاستخدامها.`,
    walletT: 'محفظة دومينوز', balance: v => `الرصيد ${v}`, useNone: 'عدم الاستخدام', useSome: v => `استخدم ${v}`, useAll: 'ادفع بالكامل',
    walletApplied: 'مدفوع من المحفظة', toPayCard: 'المتبقي للدفع',
    couponsT: 'قسائمك', applyC: 'تطبيق', removeC: 'إزالة', minOrder: v => `أنفق ${v} أو أكثر لاستخدامها`,
    needItem: n => `أضف ${n} لاستخدامها`, deliveryOnly: 'صالحة لطلبات التوصيل فقط', couponLbl: c => `قسيمة ${c}`,
    payWalletT: 'محفظتك تغطي هذا الطلب', payWalletS: 'أكّد لدفع المبلغ كاملاً من محفظتك.', payWalletBtn: 'ادفع من المحفظة',
    walletHeld: v => `تم حجز ${v} من محفظتك لهذا الطلب`, notWithWallet: 'غير متاح مع المحفظة',
    failT: 'لم يتم الدفع', failS: 'تم رفض بطاقتك. لم يتم خصم أي مبلغ.', released: v => `تم إلغاء حجز ${v} من محفظتك.`,
    retry: 'حاول مرة أخرى', simulateFail: 'محاكاة رفض البطاقة',
    paidSplit: (w, c) => `تم دفع ${w} من المحفظة و${c} بالبطاقة`, paidWallet: v => `تم دفع ${v} من محفظتك`,
    signedOut: 'حفاظاً على خصوصيتك، تم تسجيل خروجك.', fusion: 'Fusion Pay',
  });

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

  // Indicative nutrition: [kcal, protein g, carbs g, sugars g, fat g, salt g].
  // Pizzas are per Medium hand-tossed slice; everything else is per serving.
  const NUT = {
    margherita: [185, 8.2, 22, 2.1, 7.0, 0.9], pepperoni: [215, 9.4, 22, 2.0, 9.8, 1.2], veggie: [180, 7.4, 23, 2.6, 6.4, 0.9],
    chickenbbq: [205, 10.8, 25, 4.6, 6.9, 1.1], tikka: [200, 11.2, 23, 2.5, 7.1, 1.1], passion: [245, 11.0, 22, 2.0, 12.5, 1.4],
    extravaganzza: [255, 12.1, 23, 2.6, 12.8, 1.5],
    solo: [1720, 72, 210, 48, 62, 9.8], mixmatch: [3610, 168, 400, 40, 150, 20], duo: [3040, 132, 360, 34, 118, 16],
    garlic: [420, 11, 52, 3.2, 18, 1.7], cheesy: [560, 21, 54, 3.4, 28, 2.2], wedges: [330, 5.2, 46, 1.0, 14, 1.3],
    wings: [480, 38, 6, 3.8, 34, 3.1], kickers: [410, 30, 26, 0.8, 20, 2.0],
    lava: [350, 4.6, 44, 31, 17, 0.3], brownie: [410, 5.0, 52, 36, 20, 0.3],
    cola: [210, 0, 53, 53, 0, 0.05], lemon: [200, 0, 50, 50, 0, 0.1], orange: [230, 0, 58, 57, 0, 0.1], water: [0, 0, 0, 0, 0, 0],
  };

  // Allergens: c = contains, m = may contain (cross-contact).
  const ALG_NAME = {
    gluten: { en: 'Gluten', ar: 'غلوتين' }, milk: { en: 'Milk', ar: 'حليب' }, egg: { en: 'Egg', ar: 'بيض' }, soy: { en: 'Soy', ar: 'صويا' },
    mustard: { en: 'Mustard', ar: 'خردل' }, sesame: { en: 'Sesame', ar: 'سمسم' }, nuts: { en: 'Tree nuts', ar: 'مكسرات' }, celery: { en: 'Celery', ar: 'كرفس' },
  };
  const ALG_PIZZA = { c: ['gluten', 'milk'], m: ['soy', 'egg', 'sesame'] };
  const ALG_MEAT = { c: ['gluten', 'milk', 'mustard'], m: ['soy', 'egg', 'sesame'] };
  const ALG = {
    margherita: ALG_PIZZA, veggie: ALG_PIZZA, pepperoni: ALG_MEAT, tikka: ALG_MEAT, passion: ALG_MEAT,
    chickenbbq: { c: ['gluten', 'milk', 'soy', 'mustard'], m: ['egg', 'sesame'] },
    extravaganzza: { c: ['gluten', 'milk', 'soy', 'mustard'], m: ['egg', 'sesame'] },
    solo: { c: ['gluten', 'milk'], m: ['soy', 'egg', 'sesame'] },
    mixmatch: { c: ['gluten', 'milk', 'soy', 'mustard', 'celery'], m: ['egg', 'sesame'] },
    duo: { c: ['gluten', 'milk', 'mustard'], m: ['soy', 'egg', 'sesame'] },
    garlic: { c: ['gluten', 'milk'], m: ['soy', 'sesame'] }, cheesy: { c: ['gluten', 'milk'], m: ['soy', 'sesame'] },
    wedges: { c: [], m: ['gluten'] }, wings: { c: ['milk', 'soy', 'mustard', 'celery'], m: ['gluten'] },
    kickers: { c: ['gluten', 'egg', 'milk', 'soy'], m: ['mustard'] },
    lava: { c: ['gluten', 'milk', 'egg', 'soy'], m: ['nuts'] }, brownie: { c: ['gluten', 'milk', 'egg', 'soy'], m: ['nuts'] },
  };

  // Live availability from the store POS (example states). Anything not listed is in stock.
  const AVAIL = { wings: { s: 'low', left: 5 }, kickers: { s: 'later', at: '11:00' }, brownie: { s: 'out' } };
  const READY = { pizza: '12–15', deals: '12–15', sides: '8', desserts: '5', drinks: 0 };
  // Calories scale with size and crust; Small is 6 slices, Medium and Large are 8.
  const SLICES = { S: 6, M: 8, L: 8 };
  const SLICE_F = { S: .74, M: 1, L: 1.4 };
  const CRUST_F = { hand: 1, thin: .82, pan: 1.14, cheesy: 1.22 };
  const EXTRA_KCAL = 14; // per extra topping, per Medium slice
  function sliceKcal(item) {
    const base = item.half ? (NUT[item.pid][0] + NUT[item.half][0]) / 2 : NUT[item.pid][0];
    return (base * CRUST_F[item.crust] + item.extras.length * EXTRA_KCAL) * SLICE_F[item.size];
  }
  const lineKcal = it => BY_ID[it.pid].cat === 'pizza' ? sliceKcal(it) * SLICES[it.size] * it.qty : NUT[it.pid][0] * it.qty;
  const avail = id => AVAIL[id] || { s: 'in' };

  // E-coupons. pub: shown to everyone on the welcome screen; the rest are linked to the customer's mobile number.
  const COUPONS = [
    { id: 'WELCOME10', pub: true, kind: 'pct', v: 10, min: 0, en: ['10% off your order', 'First kiosk order'], ar: ['خصم ١٠٪ على طلبك', 'أول طلب من الكشك'] },
    { id: 'GARLIC', pub: true, kind: 'item', item: 'garlic', min: 40, en: ['Free Garlic Bread', 'On orders over AED 40'], ar: ['خبز بالثوم مجاناً', 'للطلبات فوق ٤٠ د.إ'] },
    { id: 'SAVE20', pub: true, kind: 'amt', v: 20, min: 100, en: ['AED 20 off', 'On orders over AED 100'], ar: ['خصم ٢٠ د.إ', 'للطلبات فوق ١٠٠ د.إ'] },
    { id: 'BDAY25', kind: 'pct', v: 25, min: 50, en: ['Birthday treat · 25% off', 'Orders over AED 50 · ends in 3 days'], ar: ['هدية عيد ميلادك · خصم ٢٥٪', 'للطلبات فوق ٥٠ د.إ · تنتهي خلال ٣ أيام'] },
    { id: 'LAVAFREE', kind: 'item', item: 'lava', min: 0, en: ['Free Choco Lava Cake', 'With any order'], ar: ['كيك الشوكولاتة الذائبة مجاناً', 'مع أي طلب'] },
    { id: 'DLV15', kind: 'amt', v: 15, min: 0, delivery: true, en: ['AED 15 off delivery', 'Delivery orders only'], ar: ['خصم ١٥ د.إ على التوصيل', 'لطلبات التوصيل فقط'] },
  ];
  const COUPON = Object.fromEntries(COUPONS.map(c => [c.id, c]));
  function couponCheck(c, S, sub) {
    if (c.delivery) return { ok: false, why: T(S).deliveryOnly };
    if (sub < c.min) return { ok: false, why: T(S).minOrder(aed(c.min, S)) };
    if (c.item && !qtyOf(S, c.item)) return { ok: false, why: T(S).needItem(name(BY_ID[c.item], S)) };
    return { ok: true };
  }
  const couponValue = (c, sub) => c.kind === 'pct' ? Math.round(sub * c.v) / 100 : c.kind === 'amt' ? c.v : BY_ID[c.item].price;

  // Profile returned by the CRM after OTP verification (demo).
  const DEMO_USER = { name: 'Ahmed', phone: '501234567', wallet: 150 };
  const maskPhone = p => `+971 ${p.slice(0, 2)} ••• ${p.slice(-4)}`;
  const fmtPhone = p => [p.slice(0, 2), p.slice(2, 5), p.slice(5, 9)].filter(Boolean).join(' ');

  // Deals: each slot is a nested choice. Pizza slots carry their own crust modifier.
  const DEAL_DEF = {
    solo: [{ k: 'pizza' }, { k: 'pick', label: 'slotSide', opts: ['garlic', 'wedges', 'cheesy'], prem: { cheesy: 3 } }, { k: 'pick', label: 'slotDrink', opts: ['cola', 'lemon', 'orange', 'water'] }],
    mixmatch: [{ k: 'pizza' }, { k: 'pizza' }, { k: 'fixed', item: 'wings' }],
    duo: [{ k: 'pizza', hand: true }, { k: 'pizza', hand: true }],
  };
  const PREMIUM = { tikka: 5, passion: 5, extravaganzza: 7 };
  function dealPrice(it) {
    const def = DEAL_DEF[it.pid];
    return BY_ID[it.pid].price + (it.picks || []).reduce((a, pk, i) => {
      if (!pk) return a;
      const slot = def[i];
      if (slot.k === 'pizza') return a + (PREMIUM[pk.pid] || 0) + CRUST[pk.crust].add;
      return a + ((slot.prem && slot.prem[pk.pid]) || 0);
    }, 0);
  }
  const MAX_EXTRAS = 5;
  const MEAT = ['pepperoni', 'chicken', 'sausage'];
  const isOff = id => ['out', 'later'].includes(avail(id).s);
  const maxQty = id => avail(id).left || 20;
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
    if (p.cat === 'deals' && item.picks) return dealPrice(item);
    if (p.cat !== 'pizza') return p.price;
    const base = item.half ? Math.max(sizePrice(p, item.size), sizePrice(BY_ID[item.half], item.size)) : sizePrice(p, item.size);
    return base + CRUST[item.crust].add + item.extras.length * EXTRA_PRICE[item.size];
  }
  function totals(S) {
    const sub = S.cart.reduce((a, it) => a + unitPrice(it) * it.qty, 0);
    const coupon = S.user && S.coupon ? COUPON[S.coupon] : null;
    const check = coupon ? couponCheck(coupon, S, sub) : null;
    const disc = coupon && check.ok ? couponValue(coupon, sub) : 0;
    const total = Math.max(0, sub - disc);
    const vat = total - total / 1.05;
    const count = S.cart.reduce((a, it) => a + it.qty, 0);
    const wallet = S.user ? Math.min(S.walletUse === 'all' ? S.user.wallet : S.walletUse, S.user.wallet, total) : 0;
    return { sub, disc, total, vat, count, coupon, check, wallet, due: Math.round((total - wallet) * 100) / 100 };
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
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    wallet: '<path d="M4 7h14a2 2 0 012 2v9a2 2 0 01-2 2H5a1 1 0 01-1-1V7z"/><path d="M4 7l11-3v3M16 13.5h2"/>',
    del: '<path d="M9 5h11v14H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/>',
    half: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/>', whole: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.4v.1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/>',
    a_gluten: '<path d="M12 21V8"/><path d="M12 8C9.8 8 8.5 6.6 8.5 4.5 10.7 4.5 12 5.9 12 8zm0 0c2.2 0 3.5-1.4 3.5-3.5C13.3 4.5 12 5.9 12 8zm0 5c-2.2 0-3.5-1.4-3.5-3.5 2.2 0 3.5 1.4 3.5 3.5zm0 0c2.2 0 3.5-1.4 3.5-3.5-2.2 0-3.5 1.4-3.5 3.5zm0 5c-2.2 0-3.5-1.4-3.5-3.5 2.2 0 3.5 1.4 3.5 3.5zm0 0c2.2 0 3.5-1.4 3.5-3.5-2.2 0-3.5 1.4-3.5 3.5z"/>',
    a_milk: '<path d="M9 3h6v3l2 3v11a1 1 0 01-1 1H8a1 1 0 01-1-1V9l2-3z"/><path d="M7 12h10"/>',
    a_egg: '<path d="M12 3c3.5 0 6 6 6 10a6 6 0 01-12 0c0-4 2.5-10 6-10z"/>',
    a_soy: '<path d="M6.5 18.5C4 15 7 6 13.5 4.5c4-.6 5.5 2.6 3.4 5.8-1.6 2.4-4 3-5.5 5.5s-2.9 5.6-4.9 2.7z"/><circle cx="13" cy="8.6" r="1.4"/><circle cx="9.6" cy="13.6" r="1.4"/>',
    a_mustard: '<path d="M9.5 3h5v3h-5z"/><path d="M8 6h8l1 3v10a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"/><path d="M7 13h10"/>',
    a_sesame: '<ellipse cx="8" cy="9" rx="2" ry="3.2" transform="rotate(-25 8 9)"/><ellipse cx="15.5" cy="8" rx="2" ry="3.2" transform="rotate(20 15.5 8)"/><ellipse cx="12" cy="16" rx="2" ry="3.2"/>',
    a_nuts: '<path d="M5 10c0-3 3-5 7-5s7 2 7 5z"/><path d="M6 10c0 6 3 10 6 10s6-4 6-10M12 5V3"/>',
    a_celery: '<path d="M8 21c0-6 1-11 4-16M12 21V5M16 21c0-6-1-11-4-16"/><path d="M10 5C8.5 4.2 7.5 3.2 7.2 2M14 5c1.5-.8 2.5-1.8 2.8-3"/>',
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

  const fmtG = (v, S) => (v >= 10 || v === 0 ? Math.round(v) : v.toFixed(1)) + (S.lang === 'ar' ? ' غ' : 'g');
  const fmtK = v => Math.round(v).toLocaleString('en-US');

  function allergenRow(p, S) {
    const t = T(S), a = ALG[p.id];
    if (!a || (!a.c.length && !a.m.length)) return `<div class="alg"><span class="free">${ic('check', 26, 3)}${t.noAllergens}</span></div>`;
    const chip = (k, cls) => `<span class="${cls}">${ic('a_' + k, 28, 1.9)}${ALG_NAME[k][S.lang]}</span>`;
    return `<div class="alg">${a.c.length ? `<div class="grp"><span class="lbl">${t.contains}</span>${a.c.map(k => chip(k, 'ac')).join('')}</div>` : ''}
      ${a.m.length ? `<div class="grp"><span class="lbl">${t.may}</span>${a.m.map(k => chip(k, 'am')).join('')}</div>` : ''}</div>`;
  }

  function nutStrip(p, S) {
    const t = T(S), n = NUT[p.id];
    const cells = n.map((v, i) => i === 0
      ? `<div class="ncell kc"><b class="num">${fmtK(v)}</b><span>${t.kcalUnit}</span></div>`
      : `<div class="ncell"><b class="num">${fmtG(v, S)}</b><span>${t.nut[i]}</span></div>`).join('');
    return `<div class="nut"><div class="nb">${t.nutrition} · ${p.cat === 'pizza' ? t.perSlice : t.perServing}</div><div class="nrow">${cells}</div></div>`;
  }

  function availChip(p, S) {
    const t = T(S), a = avail(p.id);
    const [cls, icon, text] = {
      in: ['in', 'check', READY[p.cat] ? t.avIn(READY[p.cat]) : t.avNow],
      low: ['low', 'clock', t.avLow(a.left)],
      out: ['out', 'x', t.avOut],
      later: ['out', 'clock', t.avLater(a.at)],
    }[a.s];
    return `<span class="av av-${cls}">${ic(icon, 26, 3)}${text}</span>`;
  }

  function storeBar(S) {
    const t = T(S);
    const who = S.user
      ? `<span class="who">${ic('user', 28, 2.4)}${t.hi(S.user.name)} · ${t.walletBal} <b class="num">${aed(S.user.wallet, S)}</b></span><button class="sb" data-a="signout">${t.signOut}</button>`
      : `<button class="sb" data-a="login" data-v="login">${ic('user', 28, 2.4)}${t.signIn}</button>`;
    return `<div class="storebar">${ic('pin', 28, 2.4)}<span>${t.store}</span><span class="dot">·</span><span class="mut">${t.storeMenu}</span><span class="grow"></span>${who}</div>`;
  }

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

  function accountBlock(S, tot) {
    const t = T(S), u = S.user, opts = [[0, t.useNone], [20, t.useSome(aed(20, S))], [50, t.useSome(aed(50, S))], ['all', t.useAll]]
      .filter(([v]) => v === 0 || v === 'all' || v < Math.min(u.wallet, tot.total));
    const cur = S.walletUse;
    return `<div class="acct">
      <div class="prof"><span class="av2">${u.name[0]}</span><div><b>${t.hi(u.name)}</b><span dir="ltr">${maskPhone(u.phone)}</span></div><button class="lnk" data-a="signout">${t.signOut}</button></div>
      <div class="wal"><div class="wt">${ic('wallet', 40, 2.2)}<div><b>${t.walletT}</b><span>${t.balance(aed(u.wallet, S))}</span></div></div>
        <div class="chips">${opts.map(([v, l]) => `<button class="${String(cur) === String(v) ? 'on' : ''}" data-a="wallet" data-v="${v}">${l}</button>`).join('')}</div></div>
      <div class="cps"><h4>${ic('tag', 30, 2.6)}${t.couponsT}</h4>${COUPONS.map(c => {
        const ck = couponCheck(c, S, tot.sub), on = S.coupon === c.id;
        return `<div class="cp ${on ? 'on' : ''} ${ck.ok ? '' : 'no'}"><div><b>${c[S.lang][0]}</b><span>${ck.ok ? c[S.lang][1] : ck.why}</span></div><em>${c.id}</em>
          ${ck.ok ? `<button class="${on ? 'lnk' : 'addbtn'}" data-a="${on ? 'cremove' : 'capply'}" data-v="${c.id}">${on ? t.removeC : t.applyC}</button>` : `<span class="lockd">${ic('lock', 26, 2.6)}</span>`}</div>`;
      }).join('')}</div></div>`;
  }

  function keypad() {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clr', '0', 'del'];
    return `<div class="kp" dir="ltr">${keys.map(k => `<button data-a="key" data-v="${k}" class="${k.length > 1 ? 'fn' : ''}" aria-label="${k}">${k === 'del' ? ic('del', 52, 2.4) : k === 'clr' ? 'C' : k}</button>`).join('')}</div>`;
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
        <div class="pubs"><h4>${ic('tag', 30, 2.6)}${t.pubTitle}</h4><div class="tix">${COUPONS.filter(c => c.pub).map(c => `
          <button class="tick ${S.pending === c.id ? 'on' : ''}" data-a="savecoupon" data-v="${c.id}"><b>${c[S.lang][0]}</b><span>${c[S.lang][1]}</span>
            <em>${c.id}</em><i>${ic(S.pending === c.id ? 'check' : 'plus', 24, 3)}${S.pending === c.id ? t.pubSaved : t.pubTap}</i></button>`).join('')}</div></div>
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
        const q = qtyOf(S, p.id), isPizza = p.cat === 'pizza', a = avail(p.id), off = isOff(p.id);
        const build = isPizza ? 'open' : p.cat === 'deals' ? 'deal' : null;
        const price = isPizza ? `<span class="price"><small>${t.from}</small>${aed(sizePrice(p, 'S'), S)}</span>` : `<span class="price">${aed(p.price, S)}</span>`;
        let action;
        if (off) action = `<span class="addbtn dis">${a.s === 'out' ? t.soldOut : t.fromTime(a.at)}</span>`;
        else if (build || q === 0) action = `<button class="addbtn" data-a="${build || 'add'}" data-v="${p.id}">${ic('plus', 30, 3.2)}${t.add}</button>`;
        else action = stepper(`mdec:${p.id}`, `minc:${p.id}`, q);
        return `<article class="mi ${q ? 'in' : ''} ${off ? 'off' : ''}" ${build && !off ? `data-a="${build}" data-v="${p.id}"` : ''}>
          ${q ? `<span class="count num">${q}</span>` : ''}
          <div class="top"><div class="img">${art(p)}</div>
            <div class="mc"><div class="mt"><h3>${esc(name(p, S))}</h3><div class="tags">${tagsFor(p, S)}</div></div>
              <p class="d">${esc(desc(p, S))}</p>${availChip(p, S)}
              <div class="row"><div class="pk">${price}<span class="kb">${ic('flame', 24, 2.6)}${isPizza ? t.kcalSlice(NUT[p.id][0]) : t.kcalEach(NUT[p.id][0])}</span></div>${action}</div></div></div>
          <div class="facts">${allergenRow(p, S)}${nutStrip(p, S)}</div></article>`;
      }).join('');
      return `<div class="k menu" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">
        <header class="kh">${logo(78)}<div class="grow"></div>
          <button class="pill" data-a="toggletype">${ic(S.type === 'take' ? 'bag' : 'dine', 34)}${S.type === 'take' ? t.takeShort : t.dineShort}</button>
          ${langBtn(S)}${a11yBtn(S)}<button class="ib" data-a="reset" aria-label="${t.startOver}">${ic('restart', 40)}</button></header>
        ${storeBar(S)}
        <div class="promo"><div class="t"><small>${t.promoTag}</small><div class="disp">${t.promo}</div></div>
          <button class="btn btn-white" data-a="cat" data-v="deals">${t.promoBtn}</button>${pizza(['pepperoni', 'pepper'], 'promo')}</div>
        <div class="mbody">
          <nav class="rail" data-sk="rail">${CATS.map(c => `<button class="${S.cat === c ? 'on' : ''}" data-a="cat" data-v="${c}"><span class="ri">${c === 'pizza' ? pizza(['pepperoni'], 'rail') : art(MENU.find(p => p.art === CAT_ART[c] || (c === 'drinks' && p.cat === 'drinks')))}</span>${t.cats[c]}</button>`).join('')}</nav>
          <section class="items" data-sk="items-${S.cat}"><h2 class="disp">${t.cats[S.cat]}<small>${t.itemsCount(list.length)}</small></h2><div class="list">${cards}</div></section>
        </div>
        <footer class="cartbar">
          <div class="bag">${ic('bag', 56, 2.2)}${tot.count ? `<b class="num">${tot.count}</b>` : ''}</div>
          ${tot.count ? `<div class="sum"><div>${t.items(tot.count)}</div><strong class="num">${aed(tot.total, S)}</strong></div>` : `<div class="empty">${t.emptyCart}</div>`}
          <button class="btn btn-red" data-a="go" data-v="cart" ${tot.count ? '' : 'disabled'}>${t.review}${ic('next', 40, 3, 'flip')}</button>
        </footer></div>`;
    },

    custom(S) {
      const t = T(S), c = S.custom, p = BY_ID[c.pid], L = S.lang;
      const item = { pid: c.pid, size: c.size, crust: c.crust, extras: c.extras, remove: c.remove, half: c.half, qty: c.qty };
      const scale = { S: .74, M: .87, L: 1 }[c.size];
      const veg = p.veg && (!c.half || BY_ID[c.half].veg);
      const extrasAllowed = TOPPINGS.filter(tp => !(veg && MEAT.includes(tp.id)));
      const tops1 = [...p.tops.filter(x => !c.remove.includes(x)), ...c.extras];
      const preview = c.half
        ? `${pizza(tops1, p.id, 'data-h="1"')}${pizza([...BY_ID[c.half].tops, ...c.extras], c.half, 'data-h="2"')}<i class="cut"></i>`
        : pizza(tops1, p.id);
      const why = msg => `<span class="why">${ic('lock', 22, 2.6)}${msg}</span>`;
      const sizeBlock = z => z === 'S' && (c.half ? t.noHalfSmall : c.crust === 'cheesy' ? t.noCheesySmall : null);
      const title = c.half ? t.halfOf(name(p, S), name(BY_ID[c.half], S)) : name(p, S);
      const maxed = c.extras.length >= MAX_EXTRAS;
      const removable = p.tops.filter(x => x !== 'cheese');
      return `<div class="k custom" dir="${L === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: c.editIdx != null ? 'cart' : 'menu', title: t.customise })}
        <div class="chero"><div class="pzbox ${c.half ? 'hh' : ''}" style="transform:scale(${scale})">${preview}</div>
          <div><div class="tags">${tagsFor(p, S)}</div><h2 class="disp">${esc(title)}</h2><p>${esc(c.half ? t.hhNote : desc(p, S))}</p>
            <div class="hk">${ic('flame', 36, 2.4)}<div><b class="num">${t.kcalSlice(fmtK(sliceKcal(item)))}</b><span class="num">${t.kcalWhole(fmtK(sliceKcal(item) * SLICES[c.size]))}</span></div></div></div></div>
        <div class="cpanel" data-sk="cpanel">
          <section><h3 class="disp">${t.size}</h3><div class="opts c3">${['S', 'M', 'L'].map((z, i) => { const no = sizeBlock(z); return `
            <button class="opt size ${c.size === z ? 'on' : ''} ${no ? 'dis' : ''}" ${no ? '' : `data-a="size" data-v="${z}"`}><span class="ck">${ic('check', 28, 3.4)}</span>
              <i style="width:${SIZES[z].ring}px;height:${SIZES[z].ring}px;margin:${(122 - SIZES[z].ring) / 2}px 0 ${(122 - SIZES[z].ring) / 2 + 10}px"></i><b>${t.sizes[z]}</b><span>${t.serves[i]}</span>
              ${no ? why(no) : `<span class="sk">${t.kcalSlice(fmtK(sliceKcal({ ...item, size: z })))}</span>`}<em class="num">${aed(sizePrice(p, z), S)}</em></button>`; }).join('')}</div></section>
          <section><h3 class="disp">${t.style}</h3>
            <div class="seg big"><button class="${c.half ? '' : 'on'}" data-a="half" data-v="">${ic('whole', 36, 2.4)}${t.whole}</button>
              <button class="${c.half ? 'on' : ''} ${c.size === 'S' ? 'dis' : ''}" ${c.size === 'S' ? '' : 'data-a="half" data-v="pick"'}>${ic('half', 36, 2.4)}${t.halfHalf}${c.size === 'S' ? `<small>${t.mlOnly}</small>` : ''}</button></div>
            ${c.half ? `<p class="sub2">${t.otherHalf}</p><div class="hlist">${MENU.filter(x => x.cat === 'pizza' && x.id !== c.pid && !isOff(x.id)).map(x => `
              <button class="hopt ${c.half === x.id ? 'on' : ''}" data-a="half" data-v="${x.id}">${pizza(x.tops, x.id)}<b>${esc(name(x, S))}</b><span class="num">${aed(sizePrice(x, c.size), S)}</span></button>`).join('')}</div>` : ''}</section>
          <section><h3 class="disp">${t.crust}</h3><div class="opts c2">${CRUSTS.map(cr => { const no = cr.id === 'cheesy' && c.size === 'S'; return `
            <button class="opt ${c.crust === cr.id ? 'on' : ''} ${no ? 'dis' : ''}" ${no ? '' : `data-a="crust" data-v="${cr.id}"`}><span class="ck">${ic('check', 28, 3.4)}</span>
              <b>${cr[L][0]}</b><span>${cr[L][1]}</span>${no ? why(t.mlOnly) : `<em class="num">${cr.add ? `+ ${aed(cr.add, S)}` : '&nbsp;'}</em>`}</button>`; }).join('')}</div></section>
          ${removable.length ? `<section><h3 class="disp">${t.removeT}<small>${t.removeHint}</small></h3><div class="rm">${removable.map(x => `
            <button class="rmc ${c.remove.includes(x) ? 'on' : ''}" data-a="rm" data-v="${x}">${topIcon(x)}<span>${c.remove.includes(x) ? t.no(TOP_NAME[x][L]) : TOP_NAME[x][L]}</span>${c.remove.includes(x) ? ic('x', 26, 3) : ''}</button>`).join('')}</div></section>` : ''}
          <section><h3 class="disp">${t.extras}<small>${t.maxExtras(MAX_EXTRAS)} · + ${aed(EXTRA_PRICE[c.size], S)}</small></h3>
            ${maxed ? `<p class="warn">${ic('alert', 30, 2.6)}${t.maxReached}</p>` : ''}
            <div class="opts c4">${extrasAllowed.map(tp => { const on = c.extras.includes(tp.id), no = maxed && !on; return `
            <button class="opt top ${on ? 'on' : ''} ${no ? 'dis' : ''}" ${no ? '' : `data-a="extra" data-v="${tp.id}"`}><span class="ck">${ic('check', 28, 3.4)}</span>
              ${topIcon(tp.id)}<b>${tp[L]}</b></button>`; }).join('')}</div></section>
        </div>
        <footer class="cfoot">${stepper('cdec', 'cinc', c.qty, true)}
          <button class="btn btn-red" data-a="addcustom">${c.editIdx != null ? t.update : t.addToOrder} · <span class="num">${aed(unitPrice(item) * c.qty, S)}</span></button></footer></div>`;
    },

    deal(S) {
      const t = T(S), d = S.deal, p = BY_ID[d.pid], def = DEAL_DEF[d.pid], L = S.lang;
      const left = def.filter((sl, i) => !d.picks[i]).length;
      let n = 0;
      const slots = def.map((sl, i) => {
        const pk = d.picks[i], open = d.open === i;
        if (sl.k === 'fixed') {
          const it = BY_ID[sl.item];
          return `<section class="slot done fixed"><div class="sh"><span class="sn">${i + 1}</span><div class="st"><small>${t.slotIncluded}</small><b>${esc(name(it, S))}</b><span>${esc(desc(it, S))}</span></div><span class="th">${art(it)}</span><span class="act">${ic('check', 30, 3)}</span></div></section>`;
        }
        const label = sl.k === 'pizza' ? `${t.slotPizza(++n)} · ${t.medium}` : t[sl.label];
        let meta = '';
        if (pk && sl.k === 'pizza') meta = `${CRUST[pk.crust][L][0]}${PREMIUM[pk.pid] || CRUST[pk.crust].add ? ` · + ${aed((PREMIUM[pk.pid] || 0) + CRUST[pk.crust].add, S)}` : ''}`;
        if (pk && sl.prem && sl.prem[pk.pid]) meta = `+ ${aed(sl.prem[pk.pid], S)}`;
        let opts = '';
        if (open && sl.k === 'pizza') {
          opts = `<div class="dopts c3">${MENU.filter(x => x.cat === 'pizza' && !isOff(x.id)).map(x => `
            <button class="dopt ${pk && pk.pid === x.id ? 'on' : ''}" data-a="dpick" data-v="${i}|${x.id}">${pizza(x.tops, x.id)}<b>${esc(name(x, S))}</b><span>${PREMIUM[x.id] ? t.premium(aed(PREMIUM[x.id], S)) : '&nbsp;'}</span></button>`).join('')}</div>
            ${pk ? `<div class="nest"><h4>${t.crustFor}</h4>${sl.hand ? `<p class="sub2">${ic('lock', 24, 2.6)} ${t.handOnly}</p>` : `<div class="seg">${CRUSTS.map(cr => `<button class="${pk.crust === cr.id ? 'on' : ''}" data-a="dcrust" data-v="${i}|${cr.id}">${cr[L][0]}${cr.add ? `<span>+${cr.add}</span>` : ''}</button>`).join('')}</div>`}</div>` : ''}`;
        } else if (open) {
          opts = `<div class="dopts c4">${sl.opts.filter(id => !isOff(id)).map(id => { const x = BY_ID[id]; return `
            <button class="dopt ${pk && pk.pid === id ? 'on' : ''}" data-a="dpick" data-v="${i}|${id}">${art(x)}<b>${esc(name(x, S))}</b><span>${sl.prem && sl.prem[id] ? t.premium(aed(sl.prem[id], S)) : '&nbsp;'}</span></button>`; }).join('')}</div>`;
        }
        return `<section class="slot ${open ? 'open' : ''} ${pk ? 'done' : ''}">
          <button class="sh" data-a="dslot" data-v="${i}"><span class="sn">${pk ? ic('check', 30, 3.4) : i + 1}</span>
            <div class="st"><small>${label}</small><b>${pk ? esc(name(BY_ID[pk.pid], S)) : t.choose}</b>${meta ? `<span>${meta}</span>` : ''}</div>
            ${pk ? `<span class="th">${art(BY_ID[pk.pid])}</span>` : ''}<span class="act">${pk ? t.change : t.choose}</span></button>${opts}</section>`;
      }).join('');
      return `<div class="k deal" dir="${L === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: d.editIdx != null ? 'cart' : 'menu', title: t.dealBuild })}
        <div class="dlhero"><div class="art">${art(p)}</div><div><div class="tags">${tagsFor(p, S)}</div><h2 class="disp">${esc(name(p, S))}</h2><p>${esc(desc(p, S))}</p></div></div>
        <div class="dslots" data-sk="deal">${slots}</div>
        <footer class="cfoot"><button class="btn btn-red" data-a="adddeal" ${left ? 'disabled' : ''}>${left ? t.chooseLeft(left) : `${d.editIdx != null ? t.updateDeal : t.addDeal} · <span class="num">${aed(dealPrice(d), S)}</span>`}</button></footer></div>`;
    },

    login(S) {
      const t = T(S), why = { coupon: t.whyCoupon, wallet: t.whyWallet }[S.authFor] || t.whyLogin;
      return `<div class="k auth" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: S.authReturn || 'cart', title: t.signIn })}
        <div class="abody"><div class="aicon">${ic('phone', 72, 2)}</div><h2 class="disp">${t.signInT}</h2><p class="lead">${why}</p>
          <div class="pfield" dir="ltr"><span class="cc">+971</span><span class="pn num">${fmtPhone(S.phone) || '<i>50 123 4567</i>'}</span><span class="caret"></span></div>
          ${keypad()}
          <button class="btn btn-red" data-a="send" ${S.phone.length === 9 ? '' : 'disabled'}>${t.sendCode}</button>
          <button class="btn btn-ghost" data-a="guest">${t.guest}</button>
          <p class="fine2">${ic('lock', 24, 2.4)}${t.privacy}</p></div></div>`;
    },

    otp(S) {
      const t = T(S);
      return `<div class="k auth" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: 'login', title: t.signIn })}
        <div class="abody"><div class="aicon">${ic('lock', 72, 2)}</div><h2 class="disp">${t.otpT}</h2><p class="lead">${t.otpS(`<b dir="ltr">${maskPhone(S.phone)}</b>`)}</p>
          <div class="otpbox ${S.otpErr != null ? 'err' : ''}" dir="ltr">${[0, 1, 2, 3].map(i => `<span class="${i === S.otp.length ? 'cur' : ''}">${S.otp[i] || ''}</span>`).join('')}</div>
          ${S.otpErr != null ? `<p class="warn">${ic('alert', 30, 2.6)}${t.otpErr(S.otpErr)}</p>` : `<p class="demo2">${t.otpDemo}</p>`}
          ${keypad()}
          <div class="arow"><button class="lnk" data-a="go" data-v="login">${t.changeNo}</button>
            ${S.resend > 0 ? `<span class="mut" data-count="resend">${t.resend(S.resend)}</span>` : `<button class="lnk" data-a="resendcode">${t.resendNow}</button>`}</div>
          <button class="btn btn-ghost" data-a="guest">${t.guest}</button></div></div>`;
    },

    cart(S) {
      const t = T(S), tot = totals(S);
      const lines = S.cart.map((it, i) => {
        const p = BY_ID[it.pid];
        let meta = '';
        const sep = S.lang === 'ar' ? '، ' : ', ';
        if (p.cat === 'pizza') {
          meta = `<span>${t.sizes[it.size]} · ${CRUST[it.crust][S.lang][0]}${it.half ? ` · ${t.halfHalf}` : ''}</span>`;
          if (it.remove && it.remove.length) meta += `<span>${it.remove.map(e => t.no(TOP_NAME[e][S.lang])).join(sep)}</span>`;
          if (it.extras.length) meta += `<span>+ ${it.extras.map(e => TOP_NAME[e][S.lang]).join(sep)}</span>`;
          meta += `<button class="edit" data-a="edit" data-v="${i}">${ic('edit', 28, 2.6)}${t.edit}</button>`;
        } else if (it.picks) {
          meta = `<span>${it.picks.map(pk => name(BY_ID[pk.pid], S) + (pk.crust ? ` (${CRUST[pk.crust][S.lang][0]})` : '')).join(sep)}</span>
            <button class="edit" data-a="edit" data-v="${i}">${ic('edit', 28, 2.6)}${t.edit}</button>`;
        } else meta = `<span>${esc(desc(p, S))}</span>`;
        meta = meta.replace('</span>', ` · ${p.cat === 'pizza' ? t.kcalWhole(fmtK(lineKcal({ ...it, qty: 1 }))) : t.kcalEach(fmtK(NUT[it.pid][0]))}</span>`);
        const lineName = it.half ? t.halfOf(name(p, S), name(BY_ID[it.half], S)) : name(p, S);
        return `<div class="line"><div class="th">${art(p)}</div><div class="info"><b>${esc(lineName)}</b>${meta}</div>
          ${stepper(`dec:${i}`, `inc:${i}`, it.qty)}<div class="lp num">${aed(unitPrice(it) * it.qty, S)}</div></div>`;
      }).join('');
      const ups = ['wings', 'lava', 'cola', 'garlic', 'wedges'].filter(id => !isOff(id) && (!qtyOf(S, id) || S.upsold.includes(id))).slice(0, 3);
      return `<div class="k cart" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: 'menu', title: t.yourOrder })}
        <div class="cbody" data-sk="cart">
          <div class="ctype">${ic(S.type === 'take' ? 'bag' : 'dine', 36)}${t.orderFor}: <b>${S.type === 'take' ? t.takeShort : t.dineShort}</b>
            <button class="edit" style="margin-inline-start:auto;color:var(--blue);font-weight:700;display:inline-flex;gap:8px;align-items:center" data-a="toggletype">${ic('edit', 28, 2.6)}${t.edit}</button></div>
          <div class="lines">${lines}</div>
          ${S.user ? accountBlock(S, tot) : `<div class="signin"><span class="ci">${ic('user', 44, 2.4)}</span>
            <div><b>${S.pending ? t.savedCoupon(S.pending) : t.signInBanner}</b><span>${t.signInBannerS}</span></div>
            <button class="btn btn-blue sm" data-a="login" data-v="${S.pending ? 'coupon' : 'login'}">${t.signIn}</button></div>`}
          <section class="sect"><h3 class="disp">${t.complete}</h3><div class="ups">${ups.map(id => {
            const p = BY_ID[id], on = qtyOf(S, id) > 0;
            return `<div class="up ${on ? 'added' : ''}"><div class="img">${art(p)}</div><b>${esc(name(p, S))}</b><span class="num">${aed(p.price, S)}</span>
              <button class="addbtn" data-a="${on ? 'noop' : 'upsell'}" data-v="${id}">${ic(on ? 'check' : 'plus', 30, 3.2)}${on ? t.added : t.add}</button></div>`;
          }).join('')}</div></section>
          <div class="totals"><div><span>${t.subtotal}</span><span class="num">${aed(tot.sub, S)}</span></div>
            ${tot.disc ? `<div class="disc"><span>${t.couponLbl(tot.coupon.id)}</span><span class="num">− ${aed(tot.disc, S)}</span></div>` : ''}
            <div><span>${t.vat}</span><span class="num">${aed(tot.vat, S)}</span></div>
            <div class="energy"><span>${ic('flame', 28, 2.4)}${t.energyTotal}</span><span class="num">${fmtK(S.cart.reduce((a, it) => a + lineKcal(it), 0))} kcal</span></div>
            <div class="grand"><span>${t.total}</span><span class="num">${aed(tot.total, S)}</span></div>
            ${tot.wallet ? `<div class="disc"><span>${ic('wallet', 28, 2.4)} ${t.walletApplied}</span><span class="num">− ${aed(tot.wallet, S)}</span></div>
            <div class="grand due"><span>${t.toPayCard}</span><span class="num">${aed(tot.due, S)}</span></div>` : ''}</div>
        </div>
        <footer class="cfoot"><button class="btn btn-ghost" style="flex:0 0 auto" data-a="go" data-v="menu">${ic('plus', 36, 3)}${t.addMore}</button>
          <button class="btn btn-red" data-a="go" data-v="pay">${t.toPay} · <span class="num">${aed(tot.due, S)}</span></button></footer></div>`;
    },

    pay(S) {
      const t = T(S), tot = totals(S);
      let detail, methods = '';
      if (tot.wallet && tot.due === 0) {
        detail = `<span class="pi ok">${ic('wallet', 120, 1.8)}</span><h3 class="disp">${t.payWalletT}</h3><p>${t.payWalletS}</p>
          <button class="btn btn-red" data-a="paid" data-v="wallet">${ic('wallet', 40, 2.4)}${t.payWalletBtn} · <span class="num">${aed(tot.wallet, S)}</span></button>`;
      } else {
        if (S.payFail) {
          detail = `<span class="pi bad">${ic('x', 110, 2.4)}</span><h3 class="disp">${t.failT}</h3><p>${t.failS}</p>
            ${tot.wallet ? `<p class="okline">${ic('check', 30, 3)}${t.released(aed(tot.wallet, S))}</p>` : ''}
            <button class="btn btn-red" data-a="paym" data-v="tap">${t.retry}</button>`;
        } else if (S.pay === 'tap') {
          detail = `<div class="tapart">${ic('tap', 200, 1.6)}</div><h3 class="disp">${t.tapNow}</h3><span class="down">${ic('down', 80, 3)}</span>
            <span class="wait"><i class="spin"></i>${t.waiting}</span><div class="demos"><button class="demo" data-a="paid">${t.simulate}</button><button class="demo" data-a="payfail">${t.simulateFail}</button></div>`;
        } else if (S.pay === 'counter') {
          detail = `${ic('receipt', 200, 1.4)}<h3 class="disp">${t.counterNow}</h3><p>${t.counterP}</p>
            <button class="btn btn-red" data-a="paid" data-v="counter">${ic('receipt', 40, 2.6)}${t.print}</button>`;
        } else {
          detail = `<span style="color:var(--blue)">${ic('card', 160, 1.4)}</span><h3 class="disp">${t.choose}</h3><p>${t.chooseS}</p>`;
        }
        methods = `<div class="methods">
            <button class="method ${S.pay === 'tap' ? 'on' : ''}" data-a="paym" data-v="tap"><span class="mi">${ic('tap', 52, 2.4)}</span><b>${t.tapT}</b><span>${t.tapS} · ${t.fusion}</span>
              <div class="wallets"><i>Visa</i><i>Mastercard</i><i>Apple Pay</i><i>Google Pay</i></div></button>
            <button class="method ${S.pay === 'counter' ? 'on' : ''} ${tot.wallet ? 'dis' : ''}" ${tot.wallet ? '' : 'data-a="paym" data-v="counter"'}><span class="mi">${ic('cash', 52, 2.4)}</span><b>${t.counterT}</b>
              <span>${tot.wallet ? t.notWithWallet : t.counterS}</span></button></div>`;
      }
      return `<div class="k pay" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">${header(S, { backTo: 'cart', title: t.payment })}
        <div class="pbody">
          <div class="amount"><small>${tot.wallet && tot.due ? t.toPayCard : t.amountToPay}</small><div class="disp num">${aed(tot.due || tot.total, S)}</div><span>${t.inclVat}</span></div>
          ${tot.wallet ? `<div class="split"><div><span>${t.total}</span><b class="num">${aed(tot.total, S)}</b></div><div><span>${ic('wallet', 28, 2.4)} ${t.walletApplied}</span><b class="num">− ${aed(tot.wallet, S)}</b></div>
            <p>${ic('lock', 24, 2.6)}${t.walletHeld(aed(tot.wallet, S))}</p></div>` : ''}
          ${methods}
          <div class="pdetail">${detail}</div>
        </div></div>`;
    },

    confirm(S) {
      const t = T(S), tot = totals(S);
      return `<div class="k confirm" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}">
        <div class="ctop"><div class="okc">${ic('check', 120, 3)}</div><h2 class="disp">${t.placed}</h2>
          <p>${!S.paid ? `${t.payAtCounter} · <span class="num">${aed(tot.total, S)}</span>`
            : tot.wallet && tot.due ? t.paidSplit(aed(tot.wallet, S), aed(tot.due, S))
            : tot.wallet ? t.paidWallet(aed(tot.wallet, S)) : `${t.paidVia} · <span class="num">${aed(tot.total, S)}</span>`}</p>
          ${S.user ? `<p class="so">${ic('lock', 26, 2.6)}${t.signedOut}</p>` : ''}</div>
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
    if (S.upsell) {
      const it = S.cart[S.upsell.idx], p = BY_ID[it.pid];
      const big = { ...it, size: 'L' }, diff = unitPrice(big) - unitPrice(it);
      const goes = ['garlic', 'lava', 'cola', 'wedges'].filter(id => !isOff(id)).slice(0, 3);
      s += `<div class="modal" dir="${S.lang === 'ar' ? 'rtl' : 'ltr'}"><div class="box upb">
        ${it.size !== 'L' || S.upsell.upgraded ? `<div class="upg"><div class="upz">${pizza(p.tops, p.id)}</div><div><h3 class="disp">${S.upsell.upgraded ? t.upDone : t.upTitle}</h3>
          <p>${S.upsell.upgraded ? `${t.sizes.L} · ${aed(unitPrice(it), S)}` : t.upSub(aed(diff, S))}</p>
          ${S.upsell.upgraded ? '' : `<button class="btn btn-blue sm" data-a="upgrade">${t.upYes(aed(diff, S))}</button>`}</div></div>` : ''}
        <h4>${t.goesWith}</h4><div class="gw">${goes.map(id => { const x = BY_ID[id], on = qtyOf(S, id) > 0; return `
          <div class="up ${on ? 'added' : ''}"><div class="img">${art(x)}</div><b>${esc(name(x, S))}</b><span class="num">${aed(x.price, S)} · ${fmtK(NUT[id][0])} kcal</span>
            <button class="addbtn" data-a="${on ? 'noop' : 'upadd'}" data-v="${id}">${ic(on ? 'check' : 'plus', 30, 3.2)}${on ? t.added : t.add}</button></div>`; }).join('')}</div>
        <button class="btn btn-red" data-a="upclose">${t.cont}</button></div></div>`;
    }
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

  // One session per guest: sign-in, wallet and coupon state all live here and are dropped by fresh().
  const fresh = () => ({ screen: 'attract', lang: 'en', type: 'dine', cat: 'pizza', cart: [], custom: null, deal: null, pay: null, payFail: false,
    user: null, pending: null, coupon: null, walletUse: 0, phone: '', otp: '', otpErr: null, resend: 0, authFor: null, authReturn: 'cart',
    upsell: null, upsold: [], rating: 0, orderNo: 0, paid: true, reach: false, timeout: false, tCount: 20, cCount: 20 });
  const cust = o => Object.assign({ pid: 'tikka', size: 'M', crust: 'hand', extras: [], remove: [], half: null, qty: 1, editIdx: null }, o);
  const signedIn = o => demo(Object.assign({ user: { ...DEMO_USER }, coupon: 'BDAY25', walletUse: 50, cart: JSON.parse(JSON.stringify(DEMO_CART.slice(0, 1).concat(DEMO_CART[2]))) }, o));

  const DEMO_CART = [
    { pid: 'tikka', size: 'L', crust: 'cheesy', extras: ['jalapeno', 'mushroom'], remove: [], half: null, qty: 1 },
    { pid: 'margherita', size: 'M', crust: 'hand', extras: [], remove: [], half: 'pepperoni', qty: 1 },
    { pid: 'solo', qty: 1, picks: [{ pid: 'veggie', crust: 'thin' }, { pid: 'garlic' }, { pid: 'cola' }] },
    { pid: 'wings', qty: 1 },
  ];
  const demo = o => Object.assign(fresh(), { cart: JSON.parse(JSON.stringify(DEMO_CART)), orderNo: 247 }, o);

  const BOARD = [
    { key: 'attract', title: 'Welcome · public coupons', note: 'Idle screen with today’s deal, three public coupons and one big call to action. Tapping a coupon saves it for checkout and starts the order.', s: () => fresh() },
    { key: 'attract-ar', title: 'Welcome · Arabic', note: 'Full right-to-left layout with Arabic type. Language can be switched from any screen.', s: () => Object.assign(fresh(), { lang: 'ar' }) },
    { key: 'otype', title: 'Eat in or take away', note: 'One question per screen with two large cards. Packaging and tax rules follow this choice.', s: () => Object.assign(fresh(), { screen: 'otype' }) },
    { key: 'menu-empty', title: 'Menu · categories', note: 'Category rail, store and market bar, deal banner, and full product listings. Review stays disabled until something is added.', s: () => Object.assign(fresh(), { screen: 'menu' }) },
    { key: 'menu', title: 'Menu · items added', note: 'Items in the order get a red outline and a count. Sides and drinks change quantity inline.', s: () => demo({ screen: 'menu', cat: 'sides' }) },
    { key: 'menu-stock', title: 'Menu · availability', note: 'Low stock shows the count left and caps the quantity. Sold-out and not-yet-served items stay listed, greyed out, without an Add button.', s: () => demo({ screen: 'menu', cat: 'sides', cart: [] }) },
    { key: 'menu-deals', title: 'Menu · meal bundles', note: 'Deals and meal bundles open a step-by-step builder instead of adding straight away.', s: () => demo({ screen: 'menu', cat: 'deals', cart: [] }) },
    { key: 'menu-ar', title: 'Menu · Arabic', note: 'The same listing in Arabic: product content, allergens, nutrition and availability are all translated.', s: () => demo({ screen: 'menu', lang: 'ar', cat: 'pizza' }) },
    { key: 'custom', title: 'Build your pizza', note: 'Size, style, crust, remove ingredients and extra toppings. The preview and the price in the button update with every choice.', s: () => demo({ screen: 'custom', custom: cust({ pid: 'tikka', size: 'L', crust: 'cheesy', extras: ['jalapeno', 'mushroom'], remove: ['onion'] }) }) },
    { key: 'custom-half', title: 'Half & half', note: 'Pick a second pizza for the other half. The preview splits down the middle and the price follows the higher half.', s: () => demo({ screen: 'custom', custom: cust({ pid: 'tikka', size: 'L', half: 'pepperoni' }) }) },
    { key: 'custom-rules', title: 'Combination rules', note: 'Invalid options are locked with the reason shown: Small can’t be half & half or Cheesy Crust, and extra toppings stop at five.', s: () => demo({ screen: 'custom', custom: cust({ pid: 'veggie', size: 'S', remove: ['olive'], extras: ['corn', 'jalapeno', 'tomato', 'pineapple', 'cheese'] }) }) },
    { key: 'upsell', title: 'Guided upsell', note: 'After a pizza is added: one tap to go Large, plus three sides, desserts or drinks that go with it.', s: () => demo({ screen: 'menu', cart: [{ pid: 'tikka', size: 'M', crust: 'hand', extras: [], remove: [], half: null, qty: 1 }], upsell: { idx: 0 } }) },
    { key: 'deal', title: 'Deal builder', note: 'Each slot of the deal is its own choice. Pizza slots open a second level for the crust, and premium picks show their surcharge.', s: () => demo({ screen: 'deal', deal: { pid: 'solo', picks: [{ pid: 'passion', crust: 'pan' }, null, null], open: 0, editIdx: null } }) },
    { key: 'cart', title: 'Cart · guest', note: 'Lines with every modification, quantity steppers, edit and remove. Guests can check out straight away; sign-in is offered only for wallet and coupons.', s: () => demo({ screen: 'cart', pending: 'WELCOME10' }) },
    { key: 'login', title: 'Sign in · mobile number', note: 'Shown only when a coupon or the wallet needs it. Big keypad, UAE +971 prefix, and guest checkout always one tap away.', s: () => demo({ screen: 'login', phone: '50123', authFor: 'coupon' }) },
    { key: 'otp', title: 'Verify · OTP', note: 'Four-digit code with a resend timer. The code checks itself as soon as the fourth digit goes in.', s: () => demo({ screen: 'otp', phone: '501234567', otp: '12', resend: 24 }) },
    { key: 'otp-error', title: 'Verify · wrong code', note: 'A wrong code clears the boxes and says how many tries are left.', s: () => demo({ screen: 'otp', phone: '501234567', otpErr: 2, resend: 0 }) },
    { key: 'cart-auth', title: 'Cart · signed in', note: 'Profile, wallet and coupons appear only after verification. Wallet amount is chosen with chips; ineligible coupons are locked with the reason.', s: () => signedIn({ screen: 'cart' }) },
    { key: 'pay', title: 'Payment · choose', note: 'Tap to pay by card or phone through Fusion Pay, or pay at the counter. The amount stays big on screen.', s: () => demo({ screen: 'pay' }) },
    { key: 'pay-tap', title: 'Payment · tap card', note: 'Points to the physical reader. The kiosk moves on by itself once the terminal confirms.', s: () => demo({ screen: 'pay', pay: 'tap' }) },
    { key: 'pay-split', title: 'Payment · wallet + card', note: 'Split tender: the wallet amount is held and the rest goes on the card. One order, two payment components.', s: () => signedIn({ screen: 'pay', pay: 'tap' }) },
    { key: 'pay-wallet', title: 'Payment · wallet only', note: 'When the balance covers the order, the card step is skipped. The order is sent only after the redemption is confirmed.', s: () => signedIn({ screen: 'pay', walletUse: 'all' }) },
    { key: 'pay-fail', title: 'Payment · declined', note: 'If the card fails, times out or is cancelled, the wallet hold is released and the guest can try again.', s: () => signedIn({ screen: 'pay', pay: 'tap', payFail: true }) },
    { key: 'confirm', title: 'Order confirmed', note: 'Order number, tracker, rating and receipt prompt. Returns to the welcome screen by itself.', s: () => demo({ screen: 'confirm' }) },
    { key: 'confirm-wallet', title: 'Confirmed · signed out', note: 'Shows how the order was paid, and confirms the customer has been signed out.', s: () => signedIn({ screen: 'confirm' }) },
    { key: 'timeout', title: 'Still there?', note: 'After 45 seconds with no touch, a 20-second countdown runs. Then the cart is cleared and the customer is signed out.', s: () => signedIn({ screen: 'cart', timeout: true, tCount: 14 }) },
    { key: 'reach', title: 'Accessible view', note: 'The UI drops into the lower half so it is in reach from a wheelchair.', s: () => demo({ screen: 'menu', reach: true, cat: 'pizza' }) },
  ];
  const BOARD_BY_KEY = Object.fromEntries(BOARD.map(b => [b.key, b]));

  const NOTES = {
    deal: ['Each slot is a separate choice and is marked done once picked. The next empty slot opens by itself.', 'Pizza slots have a nested crust choice. Premium pizzas and sides show their surcharge before they’re picked.', 'Add stays locked and tells the guest how many picks are left, so an incomplete deal can’t reach the cart.'],
    login: ['Sign-in is contextual: it appears only when a coupon or the wallet needs it, and guest checkout is always available.', 'Keypad is built in, so the on-screen keyboard never covers the field. UAE numbers are 9 digits after +971.'],
    otp: ['Four boxes and a resend timer. The code checks itself on the fourth digit.', 'A wrong code clears the boxes and shows how many tries are left. Demo code: 1234.'],
    attract: ['Public coupons are shown to everyone and linked to e-coupons. Tapping one saves it; it is redeemed after sign-in at checkout.', 'Readable from 3 m away: 150 px headline, a 180 px tall call to action and a pulsing ring.', 'Tap anywhere to start. Language buttons sit top right and the accessibility button bottom left.', 'Payment methods in the footer answer “do they take cards?” before the guest walks over.'],
    otype: ['One decision per screen, with 560 px tall cards.', 'The choice changes packaging and can be edited later from the menu header or order review.'],
    menu: ['Each listing shows picture, name, tags, description, price, live availability, allergens and nutrition, so guests can decide without opening anything.', 'Allergens use an icon and a word: solid chips for “Contains”, dashed for “May contain”. Never colour alone.', 'Calories lead the nutrition strip, as Dubai Municipality requires on menus. Pizzas are per Medium slice, everything else per serving.', 'Availability comes live from the POS: in stock with a ready time, low stock with a count, sold out, or a start time. Unavailable items stay visible but can’t be added.', 'Touch targets are at least 80 px (the guideline minimum is 44 pt).', 'Pizzas open the builder. Sides, desserts and drinks add inline with a stepper.', 'The order bar stays fixed. Review stays disabled until the order has an item.', 'The deal banner links to the Deals category; the offer is pulled live from the store.'],
    custom: ['Half & half splits the preview and charges the higher half.', 'Combination rules lock invalid options and say why: Small can’t be half & half or Cheesy Crust; extra toppings stop at five.', 'Remove ingredients covers the default toppings; removals show on the cart line.', 'Toppings appear on the preview as they are picked, and size scales the pizza.', 'Meat toppings are hidden on vegetarian pizzas.', 'The price in the button always shows the live total for the item.'],
    cart: ['Guests check out without signing in. Signing in unlocks the wallet and mobile-linked coupons, shown only after OTP succeeds.', 'Wallet amount is picked with chips; the total recalculates and “Left to pay” shows what goes to the card.', 'Ineligible coupons stay visible but locked, with the reason (minimum spend, missing item, delivery only).', 'Each line can be edited, changed in quantity or removed (minus at 1 becomes a bin).', 'The add-on row hides anything already in the order.', 'UAE prices include VAT, so VAT is shown as part of the total, not added on top.'],
    pay: ['Split tender: the wallet hold and the card payment are linked to one order.', 'Full redemption skips the card step; the order is sent only after the wallet confirms.', 'A declined card releases the wallet hold, says so, and offers a retry.', 'Card terminal integration: Visa, Mastercard, Apple Pay and Google Pay over NFC.', 'An arrow points to the physical reader. The screen moves on by itself when payment confirms.', 'Pay at counter prints a ticket and holds the order until it is paid.'],
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
    if (screen === 'menu') { S.custom = null; S.deal = null; }
  }

  function placeOrder(paid) {
    S.paid = paid;
    S.orderNo = 100 + Math.floor(Math.random() * 900);
    S.cCount = 20;
    go('confirm');
  }

  function verifyOtp() {
    const t = T(S);
    if (S.otp === '1234') {
      S.user = { ...DEMO_USER, phone: S.phone };
      if (S.pending) S.coupon = S.pending;
      S.walletUse = 0; S.otpErr = null;
      go(S.authReturn || 'cart');
      toast(t.welcome(S.user.name));
      return;
    }
    S.otpErr = (S.otpErr == null ? 3 : S.otpErr) - 1;
    S.otp = '';
    if (S.otpErr <= 0) { S.otpErr = null; go(S.authReturn || 'cart'); toast(t.tooMany); }
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
      case 'open': S.custom = cust({ pid: arg }); go('custom'); break;
      case 'deal': {
        const def = DEAL_DEF[arg];
        S.deal = { pid: arg, picks: def.map(sl => sl.k === 'fixed' ? { pid: sl.item } : null), open: 0, editIdx: null };
        go('deal'); break;
      }
      case 'dslot': S.deal.open = S.deal.open === +arg ? null : +arg; break;
      case 'dpick': {
        const [i, id] = arg.split('|'), d = S.deal, sl = DEAL_DEF[d.pid][+i];
        d.picks[+i] = sl.k === 'pizza' ? { pid: id, crust: (d.picks[+i] && d.picks[+i].crust) || 'hand' } : { pid: id };
        if (sl.k !== 'pizza') { const next = d.picks.findIndex(x => !x); d.open = next < 0 ? null : next; }
        break;
      }
      case 'dcrust': { const [i, cr] = arg.split('|'); S.deal.picks[+i].crust = cr; const next = S.deal.picks.findIndex(x => !x); S.deal.open = next < 0 ? null : next; break; }
      case 'adddeal': {
        const d = S.deal, item = { pid: d.pid, qty: 1, picks: JSON.parse(JSON.stringify(d.picks)) };
        if (d.editIdx != null) { item.qty = S.cart[d.editIdx].qty; S.cart[d.editIdx] = item; go('cart'); }
        else { S.cart.push(item); go('menu'); toast(t.toast(name(BY_ID[d.pid], S))); }
        S.deal = null; break;
      }
      case 'half': S.custom.half = arg === '' ? null : arg === 'pick' ? (S.custom.half || (S.custom.pid === 'pepperoni' ? 'margherita' : 'pepperoni')) : arg; break;
      case 'rm': { const r = S.custom.remove; const i = r.indexOf(arg); i < 0 ? r.push(arg) : r.splice(i, 1); break; }
      case 'savecoupon': S.pending = arg; toast(t.savedToast); go('otype'); break;
      case 'login': S.authFor = arg; S.authReturn = S.screen; S.phone = ''; go('login'); break;
      case 'key': {
        const field = S.screen === 'otp' ? 'otp' : 'phone', max = field === 'otp' ? 4 : 9;
        if (arg === 'del') S[field] = S[field].slice(0, -1);
        else if (arg === 'clr') S[field] = '';
        else if (S[field].length < max) S[field] += arg;
        if (field === 'otp' && S.otp.length === 4) verifyOtp();
        break;
      }
      case 'send': S.otp = ''; S.otpErr = null; S.resend = 30; go('otp'); break;
      case 'resendcode': S.resend = 30; S.otp = ''; S.otpErr = null; toast(t.otpS(maskPhone(S.phone))); break;
      case 'guest': go(S.authReturn || 'cart'); break;
      case 'signout': S.user = null; S.coupon = null; S.walletUse = 0; break;
      case 'capply': S.coupon = arg; break;
      case 'cremove': S.coupon = null; break;
      case 'wallet': S.walletUse = arg === 'all' ? 'all' : +arg; break;
      case 'payfail': S.payFail = true; break;
      case 'upgrade': S.cart[S.upsell.idx].size = 'L'; S.upsell.upgraded = true; break;
      case 'upadd': S.cart.push({ pid: arg, qty: 1 }); break;
      case 'upclose': S.upsell = null; break;
      case 'add': S.cart.push({ pid: arg, qty: 1 }); toast(t.toast(name(BY_ID[arg], S))); break;
      case 'upsell': S.cart.push({ pid: arg, qty: 1 }); S.upsold.push(arg); toast(t.toast(name(BY_ID[arg], S))); break;
      case 'minc': { const it = S.cart.find(i => i.pid === arg); if (qtyOf(S, arg) < maxQty(arg)) it.qty++; break; }
      case 'mdec': { const i = S.cart.findIndex(x => x.pid === arg); if (--S.cart[i].qty <= 0) S.cart.splice(i, 1); break; }
      case 'inc': { const it = S.cart[+arg]; if (qtyOf(S, it.pid) < maxQty(it.pid)) it.qty++; break; }
      case 'dec': if (--S.cart[+arg].qty <= 0) S.cart.splice(+arg, 1); if (!S.cart.length) go('menu'); break;
      case 'edit': {
        const it = S.cart[+arg];
        if (it.picks) { S.deal = { pid: it.pid, picks: JSON.parse(JSON.stringify(it.picks)), open: null, editIdx: +arg }; go('deal'); break; }
        S.custom = cust({ pid: it.pid, size: it.size, crust: it.crust, extras: [...it.extras], remove: [...(it.remove || [])], half: it.half || null, qty: it.qty, editIdx: +arg });
        go('custom'); break;
      }
      // Combination rules are enforced here as well as shown in the UI.
      case 'size': if (!(arg === 'S' && (S.custom.half || S.custom.crust === 'cheesy'))) S.custom.size = arg; break;
      case 'crust': if (!(arg === 'cheesy' && S.custom.size === 'S')) S.custom.crust = arg; break;
      case 'extra': { const e = S.custom.extras; const i = e.indexOf(arg); i < 0 ? (e.length < MAX_EXTRAS && e.push(arg)) : e.splice(i, 1); break; }
      case 'cinc': S.custom.qty = Math.min(20, S.custom.qty + 1); break;
      case 'cdec': S.custom.qty = Math.max(1, S.custom.qty - 1); break;
      case 'addcustom': {
        const c = S.custom, item = { pid: c.pid, size: c.size, crust: c.crust, extras: [...c.extras], remove: [...c.remove], half: c.half, qty: c.qty };
        if (c.editIdx != null) { S.cart[c.editIdx] = item; go('cart'); }
        else { S.cart.push(item); go('menu'); S.upsell = { idx: S.cart.length - 1 }; }
        break;
      }
      case 'rate': S.rating = +arg; break;
      case 'paym': S.pay = arg; S.payFail = false; S.payWait = 6; break;
      case 'paid': placeOrder(arg !== 'counter'); break;
      case 'noop': return;
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
    } else if (['otype', 'menu', 'custom', 'deal', 'cart', 'login', 'otp', 'pay'].includes(S.screen) && idle >= 45) {
      S.timeout = true; S.tCount = 20; render();
    }
    if (S.screen === 'confirm') {
      S.cCount--;
      if (S.cCount <= 0) { S = fresh(); render(); return; }
      const el = frame.querySelector('[data-count="confirm"]');
      if (el) el.textContent = T(S).newIn(S.cCount);
    }
    if (S.screen === 'otp' && S.resend > 0) {
      S.resend--;
      const el = frame.querySelector('[data-count="resend"]');
      if (!S.resend || !el) render(); else el.textContent = T(S).resend(S.resend);
    }
    if (S.screen === 'pay' && S.pay === 'tap' && !S.payFail && --S.payWait <= 0) placeOrder(true), render();
  }, 1000);

  // ---------- Viewer: side panel, scaling, board ----------

  const FLOW = [['attract', 'Welcome'], ['otype', 'Eat in or take away'], ['menu', 'Menu'], ['custom', 'Build your pizza'], ['deal', 'Deal builder'], ['cart', 'Cart'],
    ['login', 'Sign in'], ['otp', 'Verify code'], ['pay', 'Payment'], ['confirm', 'Order confirmed']];
  const FLOW_STATE = { attract: 'attract', otype: 'otype', menu: 'menu-empty', custom: 'custom', deal: 'deal', cart: 'cart', login: 'login', otp: 'otp', pay: 'pay', confirm: 'confirm' };

  function updateSide() {
    const flow = document.getElementById('flow');
    flow.innerHTML = FLOW.map(([k, label], i) => `<button class="${S.screen === k ? 'on' : ''}" data-jump="${FLOW_STATE[k]}"><span>${i + 1}</span>${label}</button>`).join('')
      + ['custom-half', 'upsell', 'cart-auth', 'pay-split', 'pay-fail', 'timeout', 'attract-ar'].map(k => `<button data-jump="${k}"><span>·</span>${BOARD_BY_KEY[k].title}</button>`).join('');
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

  // Requirements traceability: every sub-feature from the brief, with the screens that cover it.
  const COVERAGE = [
    ['Home & Idle Screen', [
      ['Welcome Screen', 'Display a brand-led welcome experience when the kiosk is idle.', ['attract']],
      ['Language Selection', 'Allow customers to select Arabic or English.', ['attract', 'attract-ar']],
      ['Public coupons', 'Display public coupons that will be linked to E-coupons.', ['attract', 'cart']],
      ['Start Order', 'Provide a clear CTA to begin the ordering journey.', ['attract', 'otype']]]],
    ['Menu Browsing', [
      ['Menu Categories', 'Allow customers to browse products by category.', ['menu-empty']],
      ['Market-Specific Menu', 'Display the menu structure configured for the applicable market/store.', ['menu-empty'], 'The store bar names the store and market; categories and items come from that store’s configuration.'],
      ['Product Listing', 'Display product image, name, price, description, tags, allergens, nutrition and availability.', ['menu-empty', 'menu']],
      ['Product Availability', 'Clearly indicate out-of-stock or unavailable products.', ['menu-stock']],
      ['Arabic / English Menu', 'Display menu content consistently in the selected language.', ['menu-ar']],
      ['Menu Content Validation', 'Consume validated menu content (product names, descriptions, approved image specs, allergens, item metadata and product rules) so products display reliably.', ['menu-empty'], 'Integration rule: only validated items render. Every listing field has a fixed slot, so missing or overlong content can’t break the layout.']]],
    ['Product Configuration', [
      ['Product Customization', 'Allow customers to configure products based on available options.', ['custom']],
      ['Pizza Size', 'Allow selection of pizza size where applicable.', ['custom']],
      ['Crust Selection', 'Allow customers to select available crust options.', ['custom']],
      ['Half & Half', 'Support half-and-half pizza configuration where applicable.', ['custom-half']],
      ['Add-ons / Modifiers', 'Allow customers to add or modify available product options.', ['custom', 'custom-rules']],
      ['Nested Modifiers & Complex Deals', 'Handle nested modifiers and complex deals where enabled through approved APIs.', ['deal']],
      ['Meal Bundles', 'Allow customers to select applicable meal bundles.', ['menu-deals', 'deal']],
      ['Upgrades', 'Provide applicable product upgrade options.', ['upsell', 'custom']],
      ['Price Impact', 'Display real-time price changes based on selected options.', ['custom', 'deal']],
      ['Combination Validation', 'Prevent invalid product/modifier combinations before checkout.', ['custom-rules', 'deal']]]],
    ['Upsell & Cross-sell', [
      ['Guided Upsell', 'Present structured upsell prompts (e.g. size upgrades, add-ons) during the ordering journey to increase average order value.', ['upsell']],
      ['Cross-sell', 'Suggest complementary items (sides, drinks, desserts, bundles) before checkout.', ['upsell', 'cart']]]],
    ['Cart', [
      ['Cart Summary', 'Display selected items with quantity, modifications and pricing details.', ['cart']],
      ['Quantity Management', 'Allow customers to manage item quantities.', ['cart', 'menu']],
      ['Edit Item', 'Allow customers to modify an existing cart item.', ['cart', 'custom']],
      ['Remove Item', 'Allow customers to remove items from the cart.', ['cart']],
      ['Discounts', 'Display applicable discounts.', ['cart-auth']],
      ['Wallet Redemption', 'Display wallet amount applied to the order.', ['cart-auth']],
      ['Taxes', 'Display applicable taxes.', ['cart']],
      ['Total Payable', 'Display the final amount payable.', ['cart-auth', 'pay-split']],
      ['Cart State', 'Retain cart state during the authenticated session.', ['cart-auth'], 'The cart is kept through sign-in and returns to the same place afterwards.'],
      ['Cart Clearance', 'Clear the cart on session termination or inactivity timeout.', ['timeout']]]],
    ['Customer Authentication', [
      ['Mobile Number Login', 'Allow customers to authenticate using their mobile number when required.', ['login']],
      ['OTP / Verification', 'Support OTP or another Alamar-approved verification method where required.', ['otp', 'otp-error']],
      ['Contextual Authentication / Guest Checkout', 'Keep authentication contextual: allow customers to continue as guest unless wallet or coupon redemption requires login.', ['cart', 'login']],
      ['Customer Profile', 'Retrieve customer profile after successful authentication; profile, wallet and coupon information must only be shown after authentication succeeds.', ['cart-auth']],
      ['Session Management', 'Automatically terminate the customer session after checkout, cancellation or inactivity timeout.', ['confirm-wallet', 'timeout']]]],
    ['E-Wallet', [
      ['Wallet Balance', 'Retrieve and display available wallet balance after authentication, only within the active customer session.', ['cart-auth']],
      ['Partial Redemption', 'Allow customers to use part of their available wallet balance; recalculate the remaining amount before payment.', ['cart-auth', 'pay-split']],
      ['Full Redemption', 'Allow the wallet to cover the full payable amount when sufficient balance exists; submit the order only after redemption is confirmed.', ['pay-wallet']],
      ['Split Tender', 'Support wallet combined with a Fusion Pay card or digital wallet payment, with the single order linked to both payment components.', ['pay-split']],
      ['Wallet Reversal', 'Release or reverse wallet holds in case of failed order, payment, timeout or cancellation, based on API response and Alamar business rules.', ['pay-fail']]]],
    ['E-Coupon', [
      ['Coupon Discovery', 'Retrieve mobile-number-linked eligible coupons after authentication.', ['cart-auth']]]],
  ];

  function buildCoverage() {
    const n = COVERAGE.reduce((a, [, rows]) => a + rows.length, 0);
    document.getElementById('cov-count').textContent = `${n} sub-features · ${n} designed`;
    document.getElementById('cov').innerHTML = COVERAGE.map(([f, rows]) => `<section><h2>${f}</h2><div class="tw"><table>
      <thead><tr><th>Sub-feature</th><th>Requirement</th><th>Where to see it</th></tr></thead><tbody>${rows.map(([sf, d, keys, note]) => `
      <tr><td class="sf">${sf}</td><td class="ds">${d}${note ? `<span class="nt">${note}</span>` : ''}</td>
        <td class="wh">${keys.map(k => `<button data-open="${k}">${BOARD_BY_KEY[k].title}</button>`).join('')}</td></tr>`).join('')}</tbody></table></div></section>`).join('');
  }
  document.getElementById('cov').addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (b) jump(b.dataset.open);
  });

  function showView(v) {
    document.querySelectorAll('.view').forEach(el => el.classList.toggle('on', el.dataset.view === v));
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === v));
    if (v === 'board' && !document.getElementById('grid').children.length) buildBoard();
    if (v === 'features' && !document.getElementById('cov').children.length) buildCoverage();
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
  if (['board', 'proto', 'features'].includes(hash0)) start = hash0;
  else if (BOARD_BY_KEY[hash0]) { jump(hash0); start = null; }
  if (start) showView(start);
  window.addEventListener('hashchange', () => { const k = location.hash.slice(1); if (BOARD_BY_KEY[k]) jump(k); else if (['board', 'proto', 'features'].includes(k)) showView(k); });
  if (document.fonts) document.fonts.ready.then(fitDevice);
})();
