// Auto-generated localized fallback content for all 4 supported languages.
import type { Mission, CaseStory, LawArticle } from "@/types";

export type Lang = "en" | "uz" | "ru" | "kaa";

type Bundle = { missions: Mission[]; stories: CaseStory[]; laws: LawArticle[] };

export const LOCALIZED_DATA: Record<Lang, Bundle> = {
  "en": {
    "missions": [
      {
        "id": "m_math_school",
        "interest": "math",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Build the school",
        "description": "Help build a fair school by solving sums.",
        "question": "A teacher must give 12 books equally to 4 students. How many each?",
        "options": [
          "2",
          "3",
          "4",
          "6"
        ],
        "explanation": "Fair sharing — 12 ÷ 4 = 3 books each. Equal treatment matters."
      },
      {
        "id": "m_english_city",
        "interest": "english",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Unlock the city",
        "description": "Learn the word that means doing the right thing.",
        "question": "Which English word means honesty and doing the right thing?",
        "options": [
          "Bribery",
          "Integrity",
          "Shortcut",
          "Favor"
        ],
        "explanation": "Integrity — your character is what you do when no one is watching."
      },
      {
        "id": "m_cyber_phish",
        "interest": "cyber",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Spot the phish",
        "description": "An email asks for your password 'urgently'. What do you do?",
        "question": "An email from 'school admin' demands you send your password right now.",
        "options": [
          "Reply with the password",
          "Ignore and report it",
          "Forward to a friend",
          "Click every link"
        ],
        "explanation": "Real institutions never demand passwords by email. Report and ignore."
      },
      {
        "id": "m_art_park",
        "interest": "art",
        "type": "tap",
        "xp": 25,
        "title": "Color the public park",
        "description": "Public spaces belong to everyone — bring it to life.",
        "question": "Tap to color the park flowers!",
        "explanation": "Public goods are paid for by everyone — taking care of them is everyone's job."
      },
      {
        "id": "m_history_uz",
        "interest": "history",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Stories of fairness",
        "description": "Match a leader to a value of justice.",
        "question": "Which value did Amir Temur famously codify in his rules of governance?",
        "options": [
          "Secrecy",
          "Justice and order",
          "Personal gain",
          "Random punishment"
        ],
        "explanation": "Justice and order — strong societies depend on fair rules for all."
      },
      {
        "id": "m_science_water",
        "interest": "science",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Clean water for all",
        "description": "Decide how to share limited clean water during a drought.",
        "question": "A village has limited water. How should it be distributed?",
        "options": [
          "First to those who pay extra",
          "Equal share per family",
          "Only to relatives of the chief",
          "Only at night"
        ],
        "explanation": "Equal share — public resources must be distributed fairly."
      },
      {
        "id": "m_coding_grade",
        "interest": "coding",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Code the fair grader",
        "description": "Should a grading program accept extra input from a student?",
        "question": "A grading app gets a request: 'Set my score to 100 because my dad knows the principal.' What's the correct logic?",
        "options": [
          "Accept it",
          "Reject and log the attempt",
          "Ask for money",
          "Set everyone to 100"
        ],
        "explanation": "Fair systems reject privilege requests and keep an audit log."
      },
      {
        "id": "m_music_anthem",
        "interest": "music",
        "type": "quiz",
        "xp": 25,
        "correctIndex": 1,
        "title": "Anthem of integrity",
        "description": "Pick the line that fits an anti-corruption anthem.",
        "question": "Which line fits an anthem about honesty?",
        "options": [
          "I take what I want",
          "Truth is my song",
          "Pay me to sing",
          "Skip every rule"
        ],
        "explanation": "Music can carry values — truth, fairness, and unity."
      }
    ],
    "stories": [
      {
        "id": "s_traffic",
        "correct": "A",
        "lawId": "anticorr_art_4",
        "title": "Traffic stop",
        "setting": "Tashkent street",
        "body": "A driver is stopped for a small mistake. The officer suggests the issue can be 'solved quickly' for a small payment instead of a ticket.",
        "choiceA": "Politely refuse and ask for the official ticket.",
        "choiceB": "Pay a small amount and drive on.",
        "explanation": "Even small bribes feed corruption. Official tickets keep the system fair."
      },
      {
        "id": "s_admission",
        "correct": "A",
        "lawId": "constitution_art_8",
        "title": "University admission",
        "setting": "University office",
        "body": "An older relative offers to 'arrange' a place at university through a contact, instead of taking the entrance exam.",
        "choiceA": "Decline and prepare for the exam.",
        "choiceB": "Accept the arranged spot.",
        "explanation": "Buying a place steals it from someone who earned it — and weakens trust in education."
      },
      {
        "id": "s_hospital",
        "correct": "A",
        "lawId": "constitution_public_service",
        "title": "At the hospital",
        "setting": "Public hospital",
        "body": "Your grandmother needs an appointment. A clerk hints that a small 'gift' would move her up the queue.",
        "choiceA": "Wait in the official queue.",
        "choiceB": "Give the gift to skip ahead.",
        "explanation": "Public services must be equal. Skipping the line means someone sicker waits longer."
      },
      {
        "id": "s_school",
        "correct": "A",
        "lawId": "anticorr_education",
        "title": "At school",
        "setting": "Classroom",
        "body": "A friend offers to do your homework if you pay them. You're tired and don't want to do it.",
        "choiceA": "Do your own work, even if imperfect.",
        "choiceB": "Pay your friend to do it.",
        "explanation": "Shortcuts in learning hurt only you — and prepare you for bigger shortcuts later."
      },
      {
        "id": "s_market",
        "correct": "A",
        "lawId": "anticorr_art_3",
        "title": "At the bazaar",
        "setting": "Chorsu market",
        "body": "A vendor offers a 'special price' if you don't ask for a receipt — meaning no taxes will be paid.",
        "choiceA": "Ask for the receipt.",
        "choiceB": "Pay the lower price without a receipt.",
        "explanation": "Taxes pay for schools and hospitals everyone uses. Skipping them hurts everyone."
      }
    ],
    "laws": [
      {
        "id": "constitution_art_8",
        "source": "constitution",
        "title": "Constitution — Article on equality before the law",
        "article": "Constitution of Uzbekistan",
        "plain": {
          "kid": "Rules are the same for everyone. Nobody can buy a special rule just for them.",
          "explorer": "Every person is equal before the law. No one can pay to get a different rule.",
          "teen": "All citizens are equal under the Constitution — wealth or status cannot change how the law applies.",
          "civic": "The Constitution of the Republic of Uzbekistan guarantees equality before the law and prohibits any privilege based on payment, status or position."
        }
      },
      {
        "id": "anticorr_art_3",
        "source": "anti_corruption_law",
        "title": "Anti-Corruption Law — Definition of corruption",
        "article": "Law on Combating Corruption, Art. 3",
        "plain": {
          "kid": "If someone gives a gift to skip the rules — that is corruption. It hurts everyone.",
          "explorer": "Corruption is using power dishonestly for personal gain. It is against the law.",
          "teen": "Corruption means abusing entrusted power for private benefit — including bribery, favoritism, and embezzlement.",
          "civic": "Per Art. 3 of the Law on Combating Corruption, corruption is the unlawful use of one's official position for personal gain or in the interest of others."
        }
      },
      {
        "id": "anticorr_art_4",
        "source": "anti_corruption_law",
        "title": "Anti-Corruption Law — Bribery prohibition",
        "article": "Law on Combating Corruption, Art. 4",
        "plain": {
          "kid": "Giving or taking money to break a rule is not allowed.",
          "explorer": "Offering or accepting a bribe is forbidden by law.",
          "teen": "Both giving and accepting a bribe are crimes — even just offering one is punishable.",
          "civic": "Both active and passive bribery are prohibited under Uzbek law and carry significant criminal penalties."
        }
      },
      {
        "id": "anticorr_education",
        "source": "anti_corruption_law",
        "title": "Anti-Corruption Law — Education and prevention",
        "article": "Law on Combating Corruption — Prevention",
        "plain": {
          "kid": "Learning honesty is part of growing up. That's what we do here!",
          "explorer": "The law says young people should learn how to recognize and refuse corruption.",
          "teen": "Anti-corruption education is mandated to build a culture of integrity in society.",
          "civic": "Uzbek law mandates anti-corruption education and awareness as core preventive measures, especially for youth."
        }
      },
      {
        "id": "constitution_public_service",
        "source": "constitution",
        "title": "Constitution — Public service must serve the people",
        "article": "Constitution of Uzbekistan — Public service",
        "plain": {
          "kid": "Doctors, teachers, police — they help everyone, not just people with money.",
          "explorer": "Public officials must serve all citizens fairly, not their own pocket.",
          "teen": "Public office is a public trust — officials must act in the interest of the people.",
          "civic": "Public officials must exercise their authority impartially and in the public interest, with accountability mechanisms enshrined in the Constitution."
        }
      }
    ]
  },
  "uz": {
    "missions": [
      {
        "id": "m_math_school",
        "interest": "math",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Maktab qurish",
        "description": "Adolatli maktab qurish uchun misollarni yeching.",
        "question": "O'qituvchi 4 nafar o'quvchiga 12 ta kitobni teng taqsimlashi kerak. Har biriga nechtadan?",
        "options": [
          "2",
          "3",
          "4",
          "6"
        ],
        "explanation": "Adolatli taqsimlash — 12 ÷ 4 = 3 tadan kitob. Teng munosabat muhim."
      },
      {
        "id": "m_english_city",
        "interest": "english",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Shaharni oching",
        "description": "To'g'ri ish qilish ma'nosini anglatuvchi so'zni o'rganing.",
        "question": "Qaysi inglizcha so'z halollik va to'g'ri ish qilishni anglatadi?",
        "options": [
          "Bribery",
          "Integrity",
          "Shortcut",
          "Favor"
        ],
        "explanation": "Halollik (Integrity) — sizning fe'l-atvoringiz — bu hech kim qaramaganida qilgan ishingizdir."
      },
      {
        "id": "m_cyber_phish",
        "interest": "cyber",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Fishingni aniqlang",
        "description": "Elektron pochtada sizdan 'shoshilinch' parolingiz so'ralmoqda. Nima qilasiz?",
        "question": "Maktab ma'muriyatidan kelgan xatda darhol parolingizni yuborish talab qilinmoqda.",
        "options": [
          "Parolni javob xatida yuborish",
          "E'tiborsiz qoldirish va xabar berish",
          "Do'stingizga yuborish",
          "Har bir havolani bosish"
        ],
        "explanation": "Haqiqiy tashkilotlar hech qachon elektron pochta orqali parollarni talab qilmaydi. Xabar bering va e'tiborsiz qoldiring."
      },
      {
        "id": "m_art_park",
        "interest": "art",
        "type": "tap",
        "xp": 25,
        "title": "Jamoat bog'ini ranglang",
        "description": "Jamoat joylari barchaga tegishli — uni jonlantiring.",
        "question": "Bog' gullarini ranglash uchun bosing!",
        "explanation": "Jamoat mulklari hamma tomonidan to'langan soliqlar evaziga barpo etiladi — ularga g'amxo'rlik qilish har bir insonning vazifasidir."
      },
      {
        "id": "m_history_uz",
        "interest": "history",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Adolat haqidagi hikoyalar",
        "description": "Hukmdorni adolat qadriyati bilan bog'lang.",
        "question": "Amir Temur o‘zining boshqaruv qoidalarida qaysi qadriyatni mashhur tarzda mustahkamlagan?",
        "options": [
          "Maxfiylik",
          "Adolat va tartib",
          "Shaxsiy manfaat",
          "Tasodifiy jazo"
        ],
        "explanation": "Adolat va tartib — kuchli jamiyatlar barcha uchun adolatli qoidalarga tayanadi."
      },
      {
        "id": "m_science_water",
        "interest": "science",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Hamma uchun toza suv",
        "description": "Qurg'oqchilik paytida cheklangan toza suvni qanday taqsimlash kerakligini hal qiling.",
        "question": "Qishloqda suv cheklangan. Uni qanday taqsimlash kerak?",
        "options": [
          "Qo'shimcha pul to'laganlarga birinchi",
          "Har bir oilaga teng ulush",
          "Faqat oqsoqolning qarindoshlariga",
          "Faqat tunda"
        ],
        "explanation": "Teng ulush — jamoat resurslari adolatli taqsimlanishi kerak."
      },
      {
        "id": "m_coding_grade",
        "interest": "coding",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Adolatli baholash tizimini kodlang",
        "description": "Baholash dasturi o‘quvchidan qo‘shimcha ma’lumot qabul qilishi kerakmi?",
        "question": "Baholash ilovasiga so‘rov keldi: 'Mening dadam direktorni tanigani uchun bahoimni 100 qilib qo‘ying.' To‘g‘ri mantiq qanday?",
        "options": [
          "Qabul qilish",
          "Rad etish va urinishni qayd etish",
          "Pul so'rash",
          "Hammaning bahosini 100 qilib qo'yish"
        ],
        "explanation": "Adolatli tizimlar imtiyoz so'rovlarini rad etadi va audit jurnalini yuritadi."
      },
      {
        "id": "m_music_anthem",
        "interest": "music",
        "type": "quiz",
        "xp": 25,
        "correctIndex": 1,
        "title": "Halollik madhiyasi",
        "description": "Korrupsiyaga qarshi madhiyaga mos keladigan qatorni tanlang.",
        "question": "Qaysi qator halollik haqidagi madhiyaga mos keladi?",
        "options": [
          "Xohlaganimni olaman",
          "Haqiqat mening qo'shig'im",
          "Kuylashim uchun pul to'la",
          "Har bir qoidani chetlab o't"
        ],
        "explanation": "Musiqa qadriyatlarni o'zida mujassam etishi mumkin — haqiqat, adolat va birlik."
      }
    ],
    "stories": [
      {
        "id": "s_traffic",
        "correct": "A",
        "lawId": "anticorr_art_4",
        "title": "Yo'lda to'xtatish",
        "setting": "Toshkent ko'chasi",
        "body": "Haydovchi kichik xato uchun to'xtatildi. Xodim chipta o'rniga masalani kichik to'lov evaziga 'tezda hal qilishni' taklif qiladi.",
        "choiceA": "Xushmuomalalik bilan rad etish va rasmiy jarima qog'ozini so'rash.",
        "choiceB": "Kichik miqdorda pul berib, yo'lda davom etish.",
        "explanation": "Hatto kichik poralar ham korrupsiyani oziqlantiradi. Rasmiy jarima tizimni adolatli saqlaydi."
      },
      {
        "id": "s_admission",
        "correct": "A",
        "lawId": "constitution_art_8",
        "title": "Universitetga qabul",
        "setting": "Universitet ofisi",
        "body": "Katta yoshli qarindoshingiz kirish imtihonini topshirish o‘rniga, tanishi orqali universitetga joy 'to‘g‘rilab berishni' taklif qilmoqda.",
        "choiceA": "Rad etish va imtihonga tayyorlanish.",
        "choiceB": "Tanish orqali qilingan joyni qabul qilish.",
        "explanation": "O'rinni sotib olish uni o'z kuchi bilan qo'lga kiritgan kishidan o'g'irlash demakdir — va ta'limga bo'lgan ishonchni susaytiradi."
      },
      {
        "id": "s_hospital",
        "correct": "A",
        "lawId": "constitution_public_service",
        "title": "Kasalxonada",
        "setting": "Davlat shifoxonasi",
        "body": "Buvangizga shifokor qabuliga navbat kerak. Xodim kichik bir 'sovg'a' uni navbatda yuqoriga ko'tarishiga ishora qilmoqda.",
        "choiceA": "Rasmiy navbatda kutish.",
        "choiceB": "Navbatdan o'tish uchun sovg'a berish.",
        "explanation": "Davlat xizmatlari teng bo'lishi kerak. Navbatni chetlab o'tish, sizdan ko'ra kasalroq odam uzoqroq kutishini anglatadi."
      },
      {
        "id": "s_school",
        "correct": "A",
        "lawId": "anticorr_education",
        "title": "Maktabda",
        "setting": "Sinf xonasi",
        "body": "Do'stingiz, agar pul bersangiz, uy vazifangizni qilib berishni taklif qilmoqda. Siz charchagansiz va uni qilishni xohlamaysiz.",
        "choiceA": "Nomukammal bo'lsa ham, o'z ishingizni o'zingiz qilish.",
        "choiceB": "Do'stingizga pul berib, ishni qildirish.",
        "explanation": "O'qishdagi qisqa yo'llar faqat o'zingizga zarar keltiradi — va sizni kelajakda kattaroq qisqa yo'llarga tayyorlaydi."
      },
      {
        "id": "s_market",
        "correct": "A",
        "lawId": "anticorr_art_3",
        "title": "Bozorda",
        "setting": "Chorsu bozori",
        "body": "Sotuvchi, agar chek so'ramasangiz, 'maxsus narx' taklif qilmoqda — ya'ni hech qanday soliq to'lanmaydi.",
        "choiceA": "Chekni so'rash.",
        "choiceB": "Cheksiz pastroq narxni to'lash.",
        "explanation": "Soliqlar hamma foydalanadigan maktablar va shifoxonalar uchun to'lanadi. Ulardan qochish hammaga zarar yetkazadi."
      }
    ],
    "laws": [
      {
        "id": "constitution_art_8",
        "source": "constitution",
        "title": "Konstitutsiya — Qonun oldida tenglik to'g'risidagi modda",
        "article": "O'zbekiston Konstitutsiyasi",
        "plain": {
          "kid": "Qoidalar hamma uchun bir xil. Hech kim o'zi uchun maxsus qoida sotib ololmaydi.",
          "explorer": "Har bir inson qonun oldida tengdir. Hech kim boshqacha qoidaga ega bo'lish uchun pul to'lay olmaydi.",
          "teen": "Barcha fuqarolar Konstitutsiyaga binoan tengdirlar — boylik yoki maqom qonunning qo'llanilishini o'zgartira olmaydi.",
          "civic": "O‘zbekiston Respublikasi Konstitutsiyasi qonun oldida tenglikni kafolatlaydi va to‘lov, maqom yoki lavozimga asoslangan har qanday imtiyozni taqiqlaydi."
        }
      },
      {
        "id": "anticorr_art_3",
        "source": "anti_corruption_law",
        "title": "Korrupsiyaga qarshi kurashish to‘g‘risidagi qonun — Korrupsiya ta'rifi",
        "article": "Korrupsiyaga qarshi kurashish to'g'risidagi qonun, 3-modda",
        "plain": {
          "kid": "Agar kimdir qoidalarni chetlab oʻtish uchun sovgʻa bersa, bu — korrupsiya. Bu hammaga zarar yetkazadi.",
          "explorer": "Korrupsiya — bu shaxsiy manfaat uchun hokimiyatni g'arazli niyatlarda ishlatish. Bu qonunga zid.",
          "teen": "Korrupsiya — bu ishonib topshirilgan vakolatni xususiy manfaat uchun suiiste’mol qilishdir, jumladan, poraxoʻrlik, tanish-bilishchilik va oʻzlashtirish.",
          "civic": "Korrupsiyaga qarshi kurashish to‘g‘risidagi qonunning 3-moddasiga ko‘ra, korrupsiya — shaxsning o‘z mansab mavqeidan shaxsiy yoki o‘zgalar manfaatini ko‘zlab qonunga xilof ravishda foydalanishidir."
        }
      },
      {
        "id": "anticorr_art_4",
        "source": "anti_corruption_law",
        "title": "Korrupsiyaga qarshi kurashish to‘g‘risidagi qonun — Poraxo'rlikni taqiqlash",
        "article": "Korrupsiyaga qarshi kurashish to'g'risidagi qonun, 4-modda",
        "plain": {
          "kid": "Qoidani buzish uchun pul berish yoki olish mumkin emas.",
          "explorer": "Pora taklif qilish yoki qabul qilish qonun bilan taqiqlangan.",
          "teen": "Pora berish ham, olish ham jinoyat hisoblanadi — hatto uni taklif qilishning o‘zi ham jazolanadi.",
          "civic": "O‘zbekiston qonunchiligiga ko‘ra, faol va passiv poraxo‘rlik taqiqlangan va buning uchun jiddiy jinoiy javobgarlik belgilangan."
        }
      },
      {
        "id": "anticorr_education",
        "source": "anti_corruption_law",
        "title": "Korrupsiyaga qarshi kurashish to‘g‘risidagi qonun — Ta'lim va oldini olish",
        "article": "Korrupsiyaga qarshi kurashish to'g'risidagi qonun — Oldini olish",
        "plain": {
          "kid": "Halollikni o'rganish — o'sishning bir qismidir. Biz bu yerda shuni qilamiz!",
          "explorer": "Qonunda yoshlar korrupsiyani qanday aniqlashni va unga qarshi turishni o'rganishlari kerakligi aytilgan.",
          "teen": "Jamiyatda halollik madaniyatini shakllantirish uchun korrupsiyaga qarshi ta'lim majburiy qilingan.",
          "civic": "O‘zbekiston qonunchiligi korrupsiyaga qarshi kurashishda, ayniqsa, yoshlar o‘rtasida ta’lim va xabardorlikni oshirishni asosiy profilaktika choralari sifatida belgilaydi."
        }
      },
      {
        "id": "constitution_public_service",
        "source": "constitution",
        "title": "Konstitutsiya — Davlat xizmati xalqqa xizmat qilishi kerak",
        "article": "O'zbekiston Konstitutsiyasi — Davlat xizmati",
        "plain": {
          "kid": "Shifokorlar, oʻqituvchilar, politsiya xodimlari — ular faqat puli bor odamlarga emas, hammaga yordam berishadi.",
          "explorer": "Davlat amaldorlari o‘z cho‘ntagiga emas, barcha fuqarolarga adolatli xizmat qilishlari kerak.",
          "teen": "Davlat lavozimi — bu xalq ishonchi. Mansabdor shaxslar xalq manfaatlari yoʻlida harakat qilishlari kerak.",
          "civic": "Davlat mansabdor shaxslari o‘z vakolatlarini xolis va jamoat manfaatlarini ko‘zlab amalga oshirishlari shart, hisobdorlik mexanizmlari esa Konstitutsiyada mustahkamlangan."
        }
      }
    ]
  },
  "ru": {
    "missions": [
      {
        "id": "m_math_school",
        "interest": "math",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Построить школу",
        "description": "Помоги построить честную школу, решая примеры.",
        "question": "Учитель должен раздать 12 книг поровну 4 ученикам. Сколько получит каждый?",
        "options": [
          "2",
          "3",
          "4",
          "6"
        ],
        "explanation": "Справедливое распределение — 12 ÷ 4 = по 3 книги каждому. Равное отношение имеет значение."
      },
      {
        "id": "m_english_city",
        "interest": "english",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Открыть город",
        "description": "Выучи слово, которое означает поступать правильно.",
        "question": "Какое английское слово означает честность и правильные поступки?",
        "options": [
          "Bribery",
          "Integrity",
          "Shortcut",
          "Favor"
        ],
        "explanation": "Честность (Integrity) — твой характер проявляется в том, что ты делаешь, когда никто не смотрит."
      },
      {
        "id": "m_cyber_phish",
        "interest": "cyber",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Распознать фишинг",
        "description": "В электронном письме 'срочно' просят ваш пароль. Что вы сделаете?",
        "question": "В письме от 'администрации школы' требуют немедленно отправить ваш пароль.",
        "options": [
          "Ответить письмом с паролем",
          "Проигнорировать и сообщить об этом",
          "Переслать другу",
          "Нажать на все ссылки"
        ],
        "explanation": "Настоящие организации никогда не требуют пароли по электронной почте. Сообщите и проигнорируйте."
      },
      {
        "id": "m_art_park",
        "interest": "art",
        "type": "tap",
        "xp": 25,
        "title": "Раскрась общественный парк",
        "description": "Общественные места принадлежат всем — вдохни в них жизнь.",
        "question": "Нажми, чтобы раскрасить цветы в парке!",
        "explanation": "Общественные блага оплачиваются всеми нами — заботиться о них — задача каждого."
      },
      {
        "id": "m_history_uz",
        "interest": "history",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Истории о справедливости",
        "description": "Соотнеси правителя с ценностью справедливости.",
        "question": "Какую ценность Амир Темур знаменито закрепил в своих правилах управления?",
        "options": [
          "Секретность",
          "Справедливость и порядок",
          "Личная выгода",
          "Случайное наказание"
        ],
        "explanation": "Справедливость и порядок — сильные общества зависят от честных правил для всех."
      },
      {
        "id": "m_science_water",
        "interest": "science",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Чистая вода для всех",
        "description": "Реши, как распределить ограниченное количество чистой воды во время засухи.",
        "question": "В деревне ограниченное количество воды. Как её следует распределить?",
        "options": [
          "Сначала тем, кто доплатит",
          "Равную долю на семью",
          "Только родственникам старосты",
          "Только ночью"
        ],
        "explanation": "Равная доля — общественные ресурсы должны распределяться справедливо."
      },
      {
        "id": "m_coding_grade",
        "interest": "coding",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Запрограммируй честную оценку",
        "description": "Должна ли программа для выставления оценок принимать дополнительную информацию от ученика?",
        "question": "В приложение для оценок приходит запрос: 'Поставьте мне 100, потому что мой папа знает директора'. Какая логика правильная?",
        "options": [
          "Принять запрос",
          "Отклонить и зафиксировать попытку",
          "Попросить денег",
          "Поставить всем 100"
        ],
        "explanation": "Справедливые системы отклоняют запросы о привилегиях и ведут журнал аудита."
      },
      {
        "id": "m_music_anthem",
        "interest": "music",
        "type": "quiz",
        "xp": 25,
        "correctIndex": 1,
        "title": "Гимн честности",
        "description": "Выбери строчку, которая подходит для антикоррупционного гимна.",
        "question": "Какая строчка подходит для гимна о честности?",
        "options": [
          "Я беру, что хочу",
          "Правда — моя песня",
          "Заплати, чтобы я спел",
          "Нарушай все правила"
        ],
        "explanation": "Музыка может нести в себе ценности — правду, справедливость и единство."
      }
    ],
    "stories": [
      {
        "id": "s_traffic",
        "correct": "A",
        "lawId": "anticorr_art_4",
        "title": "Остановка на дороге",
        "setting": "Улица Ташкента",
        "body": "Водителя останавливают за небольшое нарушение. Инспектор предлагает 'быстро решить' вопрос за небольшую плату вместо штрафа.",
        "choiceA": "Вежливо отказаться и попросить официальный протокол.",
        "choiceB": "Заплатить небольшую сумму и поехать дальше.",
        "explanation": "Даже небольшие взятки подпитывают коррупцию. Официальные штрафы поддерживают справедливость системы."
      },
      {
        "id": "s_admission",
        "correct": "A",
        "lawId": "constitution_art_8",
        "title": "Поступление в университет",
        "setting": "Офис университета",
        "body": "Старший родственник предлагает 'устроить' место в университете через знакомого, вместо сдачи вступительного экзамена.",
        "choiceA": "Отказаться и готовиться к экзамену.",
        "choiceB": "Принять устроенное место.",
        "explanation": "Покупка места крадет его у того, кто его заслужил, и подрывает доверие к образованию."
      },
      {
        "id": "s_hospital",
        "correct": "A",
        "lawId": "constitution_public_service",
        "title": "В больнице",
        "setting": "Государственная больница",
        "body": "Вашей бабушке нужна запись к врачу. Сотрудник намекает, что небольшой 'подарок' продвинет ее в очереди.",
        "choiceA": "Ждать в официальной очереди.",
        "choiceB": "Дать подарок, чтобы пройти без очереди.",
        "explanation": "Государственные услуги должны быть равными для всех. Пройти без очереди — значит заставить кого-то, кто болен сильнее, ждать дольше."
      },
      {
        "id": "s_school",
        "correct": "A",
        "lawId": "anticorr_education",
        "title": "В школе",
        "setting": "Классная комната",
        "body": "Друг предлагает сделать твое домашнее задание за деньги. Ты устал и не хочешь его делать.",
        "choiceA": "Сделать свою работу самому, даже если не идеально.",
        "choiceB": "Заплатить другу, чтобы он сделал.",
        "explanation": "Короткие пути в учебе вредят только тебе — и готовят тебя к более серьезным 'обходам' в будущем."
      },
      {
        "id": "s_market",
        "correct": "A",
        "lawId": "anticorr_art_3",
        "title": "На базаре",
        "setting": "Базар Чорсу",
        "body": "Продавец предлагает 'специальную цену', если вы не будете просить чек — это значит, что налоги не будут уплачены.",
        "choiceA": "Попросить чек.",
        "choiceB": "Заплатить более низкую цену без чека.",
        "explanation": "Налоги идут на оплату школ и больниц, которыми пользуются все. Уклонение от них вредит всем."
      }
    ],
    "laws": [
      {
        "id": "constitution_art_8",
        "source": "constitution",
        "title": "Конституция — Статья о равенстве перед законом",
        "article": "Конституция Узбекистана",
        "plain": {
          "kid": "Правила одинаковы для всех. Никто не может купить себе особое правило.",
          "explorer": "Каждый человек равен перед законом. Никто не может заплатить, чтобы для него действовало другое правило.",
          "teen": "Все граждане равны перед Конституцией — богатство или статус не могут изменить применение закона.",
          "civic": "Конституция Республики Узбекистан гарантирует равенство перед законом и запрещает любые привилегии, основанные на оплате, статусе или должности."
        }
      },
      {
        "id": "anticorr_art_3",
        "source": "anti_corruption_law",
        "title": "Закон о противодействии коррупции — Определение коррупции",
        "article": "Закон «О противодействии коррупции», ст. 3",
        "plain": {
          "kid": "Если кто-то дает подарок, чтобы обойти правила — это коррупция. Это вредит всем.",
          "explorer": "Коррупция — это нечестное использование власти для личной выгоды. Это противозаконно.",
          "teen": "Коррупция означает злоупотребление вверенной властью в личных интересах, включая взяточничество, фаворитизм и хищение.",
          "civic": "Согласно ст. 3 Закона «О противодействии коррупции», коррупция — это незаконное использование своего должностного положения в личных интересах или в интересах других лиц."
        }
      },
      {
        "id": "anticorr_art_4",
        "source": "anti_corruption_law",
        "title": "Закон о противодействии коррупции — Запрет взяточничества",
        "article": "Закон «О противодействии коррупции», ст. 4",
        "plain": {
          "kid": "Давать или брать деньги, чтобы нарушить правило, запрещено.",
          "explorer": "Предложение или получение взятки запрещено законом.",
          "teen": "И дача, и получение взятки являются преступлениями — даже простое предложение наказуемо.",
          "civic": "Как активное, так и пассивное взяточничество запрещено законодательством Узбекистана и влечет за собой значительную уголовную ответственность."
        }
      },
      {
        "id": "anticorr_education",
        "source": "anti_corruption_law",
        "title": "Закон о противодействии коррупции — Просвещение и профилактика",
        "article": "Закон «О противодействии коррупции» — Профилактика",
        "plain": {
          "kid": "Учиться честности — это часть взросления. Это то, что мы здесь делаем!",
          "explorer": "Закон гласит, что молодежь должна учиться распознавать коррупцию и отказываться от нее.",
          "teen": "Антикоррупционное образование является обязательным для формирования культуры добропорядочности в обществе.",
          "civic": "Законодательство Узбекистана предписывает антикоррупционное образование и просвещение в качестве основных профилактических мер, особенно для молодежи."
        }
      },
      {
        "id": "constitution_public_service",
        "source": "constitution",
        "title": "Конституция — Государственная служба должна служить народу",
        "article": "Конституция Узбекистана — Государственная служба",
        "plain": {
          "kid": "Врачи, учителя, полицейские — они помогают всем, а не только тем, у кого есть деньги.",
          "explorer": "Государственные служащие должны служить всем гражданам честно, а не своему карману.",
          "teen": "Государственная должность — это общественное доверие; чиновники должны действовать в интересах народа.",
          "civic": "Государственные должностные лица должны осуществлять свои полномочия беспристрастно и в общественных интересах, а механизмы подотчетности закреплены в Конституции."
        }
      }
    ]
  },
  "kaa": {
    "missions": [
      {
        "id": "m_math_school",
        "interest": "math",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Mektep quriw",
        "description": "Ádil mektep quriw ushın esaplardı sheshiń.",
        "question": "Muǵallim 4 oqıwshıǵa 12 kitaptı teńdey etip bólip beriwi kerek. Hár birine neshewden?",
        "options": [
          "2",
          "3",
          "4",
          "6"
        ],
        "explanation": "Ádil bólistiriw — 12 ÷ 4 = 3 kitaptan. Teń qatnas áhmiyetli."
      },
      {
        "id": "m_english_city",
        "interest": "english",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Qalanı ashiń",
        "description": "Durıs is qılıw degen mánisti ańlatatuǵın sózdi úyreniń.",
        "question": "Qaysı inglis sózi haallıq hám durıs is qılıwdı ańlatadı?",
        "options": [
          "Bribery",
          "Integrity",
          "Shortcut",
          "Favor"
        ],
        "explanation": "Haallıq (Integrity) — siz hesh kim qarap turmaǵanda ne isleseńiz, mine sol siziń minez-qulqıńız."
      },
      {
        "id": "m_cyber_phish",
        "interest": "cyber",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Fishingshi anıqlań",
        "description": "Elektron pochtańızǵa 'tezlik penen' parolińizdi sorap xat keldi. Ne qılasız?",
        "question": "'Mektep administraciyasınan' kelgen xatta parolińizdi tez arada jiberiw talap etilmekte.",
        "options": [
          "Paroldi juwap xatta jiberiw",
          "Itibarsız qaldırıw hám xabar beriw",
          "Dosıńızǵa jiberiw",
          "Hár bir siltemeni basıw"
        ],
        "explanation": "Haqıyqıy shólkemler hesh qashan elektron pochta arqalı parollerdi talap etpeydi. Xabar beriń hám itibar bermeń."
      },
      {
        "id": "m_art_park",
        "interest": "art",
        "type": "tap",
        "xp": 25,
        "title": "Jámiyetlik baǵdı boyań",
        "description": "Jámiyetlik orınlar hámmege tiyisli — oǵan jan kirgiziń.",
        "question": "Baǵ gúllerin boyaw ushın basıń!",
        "explanation": "Jámiyetlik múlkler hámme tárepinen salıqlar esabınan jaratıladı — olarǵa ǵamxorlıq qılıw hámmemizdiń wazıypamız."
      },
      {
        "id": "m_history_uz",
        "interest": "history",
        "type": "quiz",
        "xp": 30,
        "correctIndex": 1,
        "title": "Ádillik haqqında gúrrińler",
        "description": "Basshını ádillik qádiriyatı menen baylanıstırıń.",
        "question": "Amir Temur óziniń basqarıw qaǵıydalarında qaysı qádiriyattı ataqlı etip bekkemlegen?",
        "options": [
          "Jasırınlıq",
          "Ádillik hám tártip",
          "Jeke máp",
          "Tosınnan jaza"
        ],
        "explanation": "Ádillik hám tártip — kúshli jámiyetler hámme ushın ádil qaǵıydalarǵa súyenedi."
      },
      {
        "id": "m_science_water",
        "interest": "science",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Bárine taza suw",
        "description": "Qurǵaqshılıq waqtında sheklengen taza suwdı qalay bólistiriwdi sheshiń.",
        "question": "Awılda suw sheklengen. Onı qalay bólistiriw kerek?",
        "options": [
          "Qosımsha pul tólegenlerge birinshi",
          "Hár shańaraqqa teń úles",
          "Tek basshınıń aǵayinlerine",
          "Tek túnde"
        ],
        "explanation": "Teń úles — jámiyetlik resurslar ádillikli bólistiriliwi kerek."
      },
      {
        "id": "m_coding_grade",
        "interest": "coding",
        "type": "scenario",
        "xp": 40,
        "correctIndex": 1,
        "title": "Ádil bahalawshını kodlań",
        "description": "Bahalaw baǵdarlaması oqıwshıdan qosımsha maǵlıwmat qabıl etiwi kerekpe?",
        "question": "Bahalaw qosımtasına soraw keldi: 'Meniń ákem direktordı tanıǵanı ushın bahamdı 100 etip qoyıń.' Durıs logika qanday?",
        "options": [
          "Qabıl etiw",
          "Biykar etiw hám háreketti dizimge alıw",
          "Pul soraw",
          "Hámmeseni 100 etip qoyıw"
        ],
        "explanation": "Ádil sistemalar jeńillik sorawların biykar etedi hám audit jurnalın júrgizedi."
      },
      {
        "id": "m_music_anthem",
        "interest": "music",
        "type": "quiz",
        "xp": 25,
        "correctIndex": 1,
        "title": "Haallıq gimni",
        "description": "Korrupciyaǵa qarsı gimnge sáykes keletuǵın qatardı tańlań.",
        "question": "Qaysı qatar haallıq haqqındaǵı gimnge sáykes keledi?",
        "options": [
          "Neni qálesem, sonı alaman",
          "Haqıyqat meniń qosıǵım",
          "Qosıq aytıwım ushın pul tóle",
          "Hár bir qaǵıydanı shetlep ót"
        ],
        "explanation": "Muzıka qádiriyatlardı óz ishine alıwı múmkin — haqıyqat, ádillik hám birlik."
      }
    ],
    "stories": [
      {
        "id": "s_traffic",
        "correct": "A",
        "lawId": "anticorr_art_4",
        "title": "Jolda toqtatıw",
        "setting": "Tashkent kóshesi",
        "body": "Shofyordi kishkene qáte ushın toqtattı. Xızmetker shtraf ornına máseleni kishkene tólem menen 'tez sheshiwdi' usınıs etedi.",
        "choiceA": "Ádeplilik penen bas tartıw hám rásmiy shtraf qaǵazın soraw.",
        "choiceB": "Kishkene muǵdarda pul berip, joldı dawam etiw.",
        "explanation": "Hátte kishkene paralar da korrupciyanı asıradı. Rásmiy shtraf sistemanı ádil saqlaydı."
      },
      {
        "id": "s_admission",
        "correct": "A",
        "lawId": "constitution_art_8",
        "title": "Universitetke qabıllaw",
        "setting": "Universitet ofisi",
        "body": "Úlken aǵayińińiz kiriw imtixanın tapsırıw ornına, tanısı arqalı universitetke orın 'tuwrılap beriwdi' usınıs etpekte.",
        "choiceA": "Bas tartıw hám imtixanǵa tayarlanıw.",
        "choiceB": "Tanıs arqalı sheshilgen orındı qabıllaw.",
        "explanation": "Orındı satıp alıw onı óz kúshi menen qolǵa kirgizgen adamnan urlaw degen sóz — hám bilimlendiriwge bolǵan isenimdi páseytedi."
      },
      {
        "id": "s_hospital",
        "correct": "A",
        "lawId": "constitution_public_service",
        "title": "Emlewxanada",
        "setting": "Mámleketlik emlewxana",
        "body": "Apakeńizge shıpaker qabılına náwbet kerek. Xızmetker kishkene 'sawǵa' onı náwbette joqarıǵa kóteriwine ishara etpekte.",
        "choiceA": "Rásmiy náwbette kútiw.",
        "choiceB": "Náwbetten ótiw ushın sawǵa beriw.",
        "explanation": "Mámleketlik xızmetler teń bolıwı kerek. Náwbetti shetlep ótiw, sizden de nawqaslaw adamnıń uzaǵıraq kútiwin ańlatadı."
      },
      {
        "id": "s_school",
        "correct": "A",
        "lawId": "anticorr_education",
        "title": "Mektepte",
        "setting": "Klass xanası",
        "body": "Eger pul berseńiz, dosıńız úy tapsırmańızdı orınlap beriwdi usınıs etpekte. Siz sharshaǵansız hám onı orınlawdı qálemeypeysiz.",
        "choiceA": "Jetilispegen bolsa da, óz jumısıńızdı ózińiz orınlaw.",
        "choiceB": "Dosıńızǵa pul berip, jumıstı orınlatıw.",
        "explanation": "Oqıwdaǵı qısqa jollar tek ózińizge zıyan keltiredi — hám sizi keleshekte úlkenirek qısqa jollarǵa tayarlaydı."
      },
      {
        "id": "s_market",
        "correct": "A",
        "lawId": "anticorr_art_3",
        "title": "Bazarda",
        "setting": "Chorsu bazarı",
        "body": "Satıwshı, eger chek soramasańız, 'arnawlı baha' usınıs etpekte — bul hesh qanday salıq tólenbeydi degendi ańlatadı.",
        "choiceA": "Chekti soraw.",
        "choiceB": "Cheksiz tómenirek bahanı tólew.",
        "explanation": "Salıqlar hámme paydalanatuǵın mektepler hám emlewxanalar ushın tólenedi. Olardan qashıw hámmege zıyan keltiredi."
      }
    ],
    "laws": [
      {
        "id": "constitution_art_8",
        "source": "constitution",
        "title": "Konstituciya — Nızam aldında teńlik haqqındaǵı statya",
        "article": "Ózbekstan Konstituciyası",
        "plain": {
          "kid": "Qaǵıydalar hámme ushın birdey. Hesh kim ózi ushın arnawlı qaǵıyda satıp ala almaydı.",
          "explorer": "Hár bir insan nızam aldında teń. Hesh kim basqasha qaǵıydaǵa iye bolıw ushın pul tóley almaydı.",
          "teen": "Barlıq puqaralar Konstituciyaǵa muwapıq teń — baylıq yaki status nızamnıń qollanılıwın ózgerte almaydı.",
          "civic": "Ózbekstan Respublikası Konstituciyası nızam aldında teńlikti kepilleydi hám tólem, status yamasa lawazımǵa tiykarlanǵan hár qanday jeńilliklerdi qadaǵan etedi."
        }
      },
      {
        "id": "anticorr_art_3",
        "source": "anti_corruption_law",
        "title": "Korrupciyaǵa qarsı gúresiw haqqındaǵı nızam — Korrupciyanıń anıqlaması",
        "article": "Korrupciyaǵa qarsı gúresiw haqqındaǵı nızam, 3-statya",
        "plain": {
          "kid": "Eger kim de kim qaǵıydalardı atlap ótiw ushın sawǵa berse, bul — korrupciya. Bul hámmege zıyan.",
          "explorer": "Korrupciya — bul jeke máp ushın hákimiyattı nadurıs paydalanıw. Bul nızamǵa qarsı.",
          "teen": "Korrupciya isenip tapsırılǵan wákillikti jeke payda ushın suyiistemal qılıwdı ańlatadı, sonıń ishinde para alıw, tanıs-bilislik hám ózlestiriw bar.",
          "civic": "«Korrupciyaǵa qarsı gúresiw haqqındaǵı» Nızamnıń 3-statyası boyınsha, korrupciya — shaxstıń óz lawazımlıq ornınan jeke yamasa basqalardıń mápleri jolında nızamǵa qarsı paydalanıwı."
        }
      },
      {
        "id": "anticorr_art_4",
        "source": "anti_corruption_law",
        "title": "Korrupciyaǵa qarsı gúresiw haqqındaǵı nızam — Para alıwdı qadaǵan etiw",
        "article": "Korrupciyaǵa qarsı gúresiw haqqındaǵı nızam, 4-statya",
        "plain": {
          "kid": "Qaǵıydanı buzıw ushın pul beriw yamasa alıw múmkin emes.",
          "explorer": "Para usınıs etiw yamasa qabıllaw nızam menen qadaǵan etilgen.",
          "teen": "Para beriw de, alıw da jınayat esaplanadı — hátte onı usınıwdıń ózi de jazalanadı.",
          "civic": "Ózbekstan nızamshılıǵına muwapıq, aktiv hám passiv paralıq qadaǵan etilgen hám bul ushın ádewir jınayıy juwapkershilik belgilengen."
        }
      },
      {
        "id": "anticorr_education",
        "source": "anti_corruption_law",
        "title": "Korrupciyaǵa qarsı gúresiw haqqındaǵı nızam — Bilim beriw hám aldın alıw",
        "article": "Korrupciyaǵa qarsı gúresiw haqqındaǵı nızam — Aldın alıw",
        "plain": {
          "kid": "Haallıqtı úyreniw — ósiwdiń bir bólegi. Biz bul jerde usını qılamız!",
          "explorer": "Nızamda jaslar korrupciyanı qalay tanıwdı hám oǵan qarsı turıwdı úyreniwi kerekligi aytılǵan.",
          "teen": "Jámiyette haallıq mádeniyatın qáliplestiriw ushın korrupciyaǵa qarsı bilim beriw májbúriy etip belgilengen.",
          "civic": "Ózbekstan nızamshılıǵı korrupciyaǵa qarsı gúresiwde, ásirese, jaslar arasında bilim beriwdi hám xabardarlıqtı arttırıwdı tiykarǵı profilaktikalıq ilajlar sıpatında belgileydi."
        }
      },
      {
        "id": "constitution_public_service",
        "source": "constitution",
        "title": "Konstitutsiya — Mámleketlik xızmet xalıqqa xızmet etiwi kerek",
        "article": "Ózbekstan Konstituciyası — Mámleketlik xızmet",
        "plain": {
          "kid": "Shıpakerler, muǵallimler, policiya xızmetkerleri — olar tek pulı bar adamlarǵa emes, hámmege járdem beredi.",
          "explorer": "Mámleketlik xızmetkerler óz qaltasına emes, barlıq puqaralarǵa ádil xızmet etiwi kerek.",
          "teen": "Mámleketlik lawazım — bul xalıq isenimi. Lawazımlı shaxslar xalıq mápleri jolında háreket etiwi kerek.",
          "civic": "Mámleketlik lawazımlı shaxslar óz wákilliklerin biyǵárez hám jámiyetlik máplerdi gózlep ámelge asırıwı kerek, al esabatlılıq mexanizmleri Konstituciyada bekkemlengen."
        }
      }
    ]
  }
} as Record<Lang, Bundle>;

export const getMissions = (lang: Lang): Mission[] => LOCALIZED_DATA[lang]?.missions ?? LOCALIZED_DATA.en.missions;
export const getStories = (lang: Lang): CaseStory[] => LOCALIZED_DATA[lang]?.stories ?? LOCALIZED_DATA.en.stories;
export const getLaws = (lang: Lang): LawArticle[] => LOCALIZED_DATA[lang]?.laws ?? LOCALIZED_DATA.en.laws;
export const lawByIdLocalized = (id: string, lang: Lang): LawArticle => {
  const list = getLaws(lang);
  return list.find((l) => l.id === id) ?? list[1];
};
