export type FacultyRegistry = {
  name: string;
  nameKey: string;
  majors: string[];
  majorKeys: string[];
  interests: string[];
  logoPath: string;
};

export type UniversityRegistry = {
  name: string;
  nameKey: string;
  logoPath: string;
  faculties: Record<string, FacultyRegistry>;
};

const BLOB_BASE_PATH = "universities";

export const UNIVERSITIES: Record<string, UniversityRegistry> = {
  // 1. Київський політехнічний інститут
  "kpi.ua": {
    name: "КПІ ім. Ігоря Сікорського",
    nameKey: "university.kpi.name",
    logoPath: `${BLOB_BASE_PATH}/kpi.ua/logo.png`,
    faculties: {
      "FIOT": {
        name: "Факультет інформатики та обчислювальної техніки",
        nameKey: "faculty.kpi.fiot.name",
        majors: ["Комп'ютерні науки", "Інженерія програмного забезпечення", "Кібербезпека"],
        majorKeys: ["major.computer-science", "major.software-engineering", "major.cybersecurity"],
        interests: ["programming", "software engineering", "cybersecurity", "web development", "databases"],
        logoPath: `${BLOB_BASE_PATH}/kpi.ua/FIOT/logo.png`
      },
      "IASA": {
        name: "Навчально-науковий інститут прикладного системного аналізу",
        nameKey: "faculty.kpi.iasa.name",
        majors: ["Системний аналіз", "Комп'ютерні науки", "Штучний інтелект"],
        majorKeys: ["major.system-analysis", "major.computer-science", "major.artificial-intelligence"],
        interests: ["mathematics", "data science", "machine learning", "ai", "algorithms"],
        logoPath: `${BLOB_BASE_PATH}/kpi.ua/IASA/logo.png`
      },
      "FEL": {
        name: "Факультет електроніки",
        nameKey: "faculty.kpi.fel.name",
        majors: ["Електроніка", "Мікро- та наносистемна техніка", "Телекомунікації"],
        majorKeys: ["major.electronics", "major.micro-nanosystems", "major.telecommunications"],
        interests: ["electronics", "embedded systems", "iot", "hardware"],
        logoPath: `${BLOB_BASE_PATH}/kpi.ua/FEL/logo.png`
      },
      "FMM": {
        name: "Факультет менеджменту та маркетингу",
        nameKey: "faculty.kpi.fmm.name",
        majors: ["Менеджмент", "Економіка", "Маркетинг"],
        majorKeys: ["major.management", "major.economics", "major.marketing"],
        interests: ["management", "economics", "startups", "analytics"],
        logoPath: `${BLOB_BASE_PATH}/kpi.ua/FMM/logo.png`
      }
    }
  },

  // 2. Львівський національний університет
  "lnu.edu.ua": {
    name: "ЛНУ ім. Івана Франка",
    nameKey: "university.lnu.name",
    logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/logo.jpg`,
    faculties: {
      "Bio": {
        name: "Біологічний факультет",
        nameKey: "faculty.lnu.bio.name",
        majors: ["Біологія", "Екологія"],
        majorKeys: ["major.biology", "major.ecology"],
        interests: ["biology", "ecology", "research", "genetics"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Bio/logo.png`
      },
      "Geo": {
        name: "Географічний факультет",
        nameKey: "faculty.lnu.geo.name",
        majors: ["Географія", "Туризм", "Науки про Землю"],
        majorKeys: ["major.geography", "major.tourism", "major.earth-sciences"],
        interests: ["geography", "tourism", "earth sciences", "ecology"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Geo/logo.png`
      },
      "Geology": {
        name: "Геологічний факультет",
        nameKey: "faculty.lnu.geology.name",
        majors: ["Геологія"],
        majorKeys: ["major.geology"],
        interests: ["geology", "earth sciences", "research"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Geology/logo.png`
      },
      "Economics": {
        name: "Економічний факультет",
        nameKey: "faculty.lnu.economics.name",
        majors: ["Економіка", "Менеджмент", "Маркетинг", "Фінанси"],
        majorKeys: ["major.economics", "major.management", "major.marketing", "major.finance"],
        interests: ["finance", "economics", "business", "analytics"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Economics/logo.png`
      },
      "Electronics": {
        name: "Факультет електроніки та комп'ютерних технологій",
        nameKey: "faculty.lnu.electronics.name",
        majors: ["Інженерія програмного забезпечення", "Комп'ютерні науки", "Мікро- та наносистемна техніка"],
        majorKeys: ["major.software-engineering", "major.computer-science", "major.micro-nanosystems"],
        interests: ["electronics", "software engineering", "iot", "hardware", "programming"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Electronics/logo.png`
      },
      "Journalism": {
        name: "Факультет журналістики",
        nameKey: "faculty.lnu.journalism.name",
        majors: ["Журналістика"],
        majorKeys: ["major.journalism"],
        interests: ["journalism", "media", "writing", "communications"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Journalism/logo.png`
      },
      "ForeignLangs": {
        name: "Факультет іноземних мов",
        nameKey: "faculty.lnu.foreign-langs.name",
        majors: ["Філологія (переклад)", "Прикладна лінгвістика"],
        majorKeys: ["major.philology-translation", "major.applied-linguistics"],
        interests: ["languages", "translation", "linguistics", "communication"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/ForeignLangs/logo.png`
      },
      "History": {
        name: "Історичний факультет",
        nameKey: "faculty.lnu.history.name",
        majors: ["Історія", "Археологія", "Соціологія"],
        majorKeys: ["major.history", "major.archeology", "major.sociology"],
        interests: ["history", "archeology", "culture", "research"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/History/logo.png`
      },
      "CultureArts": {
        name: "Факультет культури і мистецтв",
        nameKey: "faculty.lnu.culture-arts.name",
        majors: ["Культурологія", "Хореографія", "Сценічне мистецтво", "Музичне мистецтво"],
        majorKeys: ["major.cultural-studies", "major.choreography", "major.performing-arts", "major.music"],
        interests: ["arts", "culture", "theater", "music"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/CultureArts/logo.png`
      },
      "MechMath": {
        name: "Механіко-математичний факультет",
        nameKey: "faculty.lnu.mech-math.name",
        majors: ["Математика", "Статистика", "Середня освіта (Математика)"],
        majorKeys: ["major.mathematics", "major.statistics", "major.secondary-education-math"],
        interests: ["mathematics", "statistics", "modeling", "education"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/MechMath/logo.png`
      },
      "IntRelations": {
        name: "Факультет міжнародних відносин",
        nameKey: "faculty.lnu.int-relations.name",
        majors: ["Міжнародні відносини", "Міжнародне право", "Міжнародна економіка"],
        majorKeys: ["major.international-relations", "major.international-law", "major.international-economics"],
        interests: ["international relations", "diplomacy", "politics", "law", "economics"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/IntRelations/logo.png`
      },
      "Pedagogy": {
        name: "Факультет педагогічної освіти",
        nameKey: "faculty.lnu.pedagogy.name",
        majors: ["Початкова освіта", "Дошкільна освіта", "Спеціальна освіта"],
        majorKeys: ["major.primary-education", "major.preschool-education", "major.special-education"],
        interests: ["education", "teaching", "pedagogy", "psychology"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Pedagogy/logo.png`
      },
      "AMI": {
        name: "Факультет прикладної математики та інформатики",
        nameKey: "faculty.lnu.ami.name",
        majors: ["Прикладна математика", "Комп'ютерні науки", "Системний аналіз", "Кібербезпека"],
        majorKeys: ["major.applied-mathematics", "major.computer-science", "major.system-analysis", "major.cybersecurity"],
        interests: ["programming", "ai", "machine learning", "data science", "databases"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/AMI/logo.jpg`
      },
      "FinancialManagement": {
        name: "Факультет управління фінансами та бізнесу",
        nameKey: "faculty.lnu.financial-management.name",
        majors: ["Фінанси, банківська справа та страхування", "Облік і оподаткування", "Публічне управління"],
        majorKeys: ["major.finance-banking-insurance", "major.accounting-taxation", "major.public-administration"],
        interests: ["finance", "accounting", "banking", "management"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/FinancialManagement/logo.png`
      },
      "Physics": {
        name: "Фізичний факультет",
        nameKey: "faculty.lnu.physics.name",
        majors: ["Фізика", "Астрономія", "Прикладна фізика"],
        majorKeys: ["major.physics", "major.astronomy", "major.applied-physics"],
        interests: ["physics", "astronomy", "quantum mechanics", "research"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Physics/logo.png`
      },
      "Philology": {
        name: "Філологічний факультет",
        nameKey: "faculty.lnu.philology.name",
        majors: ["Українська мова та література", "Слов'янські мови"],
        majorKeys: ["major.ukrainian-language-literature", "major.slavic-languages"],
        interests: ["philology", "literature", "writing", "linguistics"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Philology/logo.png`
      },
      "Philosophy": {
        name: "Філософський факультет",
        nameKey: "faculty.lnu.philosophy.name",
        majors: ["Філософія", "Політологія", "Психологія", "Культурологія"],
        majorKeys: ["major.philosophy", "major.political-science", "major.psychology", "major.cultural-studies"],
        interests: ["philosophy", "psychology", "politics", "research"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Philosophy/logo.png`
      },
      "Chemistry": {
        name: "Хімічний факультет",
        nameKey: "faculty.lnu.chemistry.name",
        majors: ["Хімія"],
        majorKeys: ["major.chemistry"],
        interests: ["chemistry", "lab work", "materials", "research"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Chemistry/logo.png`
      },
      "Law": {
        name: "Юридичний факультет",
        nameKey: "faculty.lnu.law.name",
        majors: ["Право"],
        majorKeys: ["major.law"],
        interests: ["legal", "human rights", "debate", "politics"],
        logoPath: `${BLOB_BASE_PATH}/lnu.edu.ua/Law/logo.png`
      }
    }
  },

  // 3. Київський національний університет
  "knu.ua": {
    name: "КНУ ім. Тараса Шевченка",
    nameKey: "university.knu.name",
    logoPath: `${BLOB_BASE_PATH}/knu.ua/logo.png`,
    faculties: {
      "FIT": {
        name: "Факультет інформаційних технологій",
        nameKey: "faculty.knu.fit.name",
        majors: ["Інженерія програмного забезпечення", "Комп'ютерні науки", "Кібербезпека", "Телекомунікації"],
        majorKeys: ["major.software-engineering", "major.computer-science", "major.cybersecurity", "major.telecommunications"],
        interests: ["programming", "networks", "cybersecurity", "software architecture"],
        logoPath: `${BLOB_BASE_PATH}/knu.ua/FIT/logo.png`
      },
      "Cybernetics": {
        name: "Факультет комп'ютерних наук та кібернетики",
        nameKey: "faculty.knu.cybernetics.name",
        majors: ["Прикладна математика", "Інформаційні системи та технології"],
        majorKeys: ["major.applied-mathematics", "major.information-systems"],
        interests: ["algorithms", "machine learning", "data analytics", "robotics", "ai"],
        logoPath: `${BLOB_BASE_PATH}/knu.ua/Cybernetics/logo.png`
      },
      "Economics": {
        name: "Економічний факультет",
        nameKey: "faculty.knu.economics.name",
        majors: ["Економіка", "Облік і оподаткування", "Підприємництво"],
        majorKeys: ["major.economics", "major.accounting-taxation", "major.entrepreneurship"],
        interests: ["finance", "economics", "entrepreneurship", "accounting"],
        logoPath: `${BLOB_BASE_PATH}/knu.ua/Economics/logo.png`
      }
    }
  },

  // 4. Львівська політехніка
  "lpnu.ua": {
    name: "Національний університет «Львівська політехніка»",
    nameKey: "university.lpnu.name",
    logoPath: `${BLOB_BASE_PATH}/lpnu.ua/logo.png`,
    faculties: {
      "IADU": {
        name: "Інститут адміністрування, державного управління та професійного розвитку",
        nameKey: "faculty.lpnu.iadu.name",
        majors: ["Публічне управління та адміністрування"],
        majorKeys: ["major.public-administration"],
        interests: ["management", "public administration", "leadership"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IADU/logo.png`
      },
      "IARD": {
        name: "Інститут архітектури та дизайну",
        nameKey: "faculty.lpnu.iard.name",
        majors: ["Архітектура та містобудування", "Дизайн"],
        majorKeys: ["major.architecture-urban-planning", "major.design"],
        interests: ["architecture", "design", "urban planning", "arts"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IARD/logo.png`
      },
      "IBIB": {
        name: "Інститут будівництва, інфраструктури та безпеки життєдіяльності",
        nameKey: "faculty.lpnu.ibib.name",
        majors: ["Будівництво та цивільна інженерія", "Цивільна безпека"],
        majorKeys: ["major.civil-engineering", "major.civil-safety"],
        interests: ["civil engineering", "infrastructure", "safety"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IBIB/logo.png`
      },
      "IGDG": {
        name: "Інститут геодезії",
        nameKey: "faculty.lpnu.igdg.name",
        majors: ["Геодезія та землеустрій", "Науки про Землю"],
        majorKeys: ["major.geodesy-land-management", "major.earth-sciences"],
        interests: ["geodesy", "mapping", "earth sciences"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IGDG/logo.png`
      },
      "IGSN": {
        name: "Інститут гуманітарних та соціальних наук",
        nameKey: "faculty.lpnu.igsn.name",
        majors: ["Соціологія", "Соціальна робота", "Міжнародні відносини"],
        majorKeys: ["major.sociology", "major.social-work", "major.international-relations"],
        interests: ["social sciences", "humanities", "sociology", "international relations"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IGSN/logo.png`
      },
      "INEM": {
        name: "Інститут економіки і менеджменту",
        nameKey: "faculty.lpnu.inem.name",
        majors: ["Економіка", "Менеджмент", "Маркетинг"],
        majorKeys: ["major.economics", "major.management", "major.marketing"],
        interests: ["economics", "management", "business", "marketing"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/INEM/logo.png`
      },
      "IESK": {
        name: "Інститут енергетики та систем керування",
        nameKey: "faculty.lpnu.iesk.name",
        majors: ["Електроенергетика", "Теплоенергетика"],
        majorKeys: ["major.electrical-power-engineering", "major.thermal-power-engineering"],
        interests: ["energy", "power engineering", "control systems"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IESK/logo.png`
      },
      "IKTE": {
        name: "Інститут інформаційно-комунікаційних технологій та електронної інженерії",
        nameKey: "faculty.lpnu.ikte.name",
        majors: ["Телекомунікації", "Електроніка", "Мікро- та наносистемна техніка"],
        majorKeys: ["major.telecommunications", "major.electronics", "major.micro-nanosystems"],
        interests: ["telecommunications", "electronics", "hardware", "networks"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IKTE/logo.png`
      },
      "IKNI": {
        name: "Інститут комп'ютерних наук та інформаційних технологій",
        nameKey: "faculty.lpnu.ikni.name",
        majors: ["Комп'ютерні науки", "Інформаційні системи та технології", "Системний аналіз"],
        majorKeys: ["major.computer-science", "major.information-systems", "major.system-analysis"],
        interests: ["programming", "data science", "it", "ai"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IKNI/logo.png`
      },
      "IKTA": {
        name: "Інститут комп'ютерних технологій, автоматики та метрології",
        nameKey: "faculty.lpnu.ikta.name",
        majors: ["Кібербезпека", "Автоматизація та комп'ютерно-інтегровані технології", "Метрологія"],
        majorKeys: ["major.cybersecurity", "major.automation-computer-integrated", "major.metrology"],
        interests: ["automation", "cybersecurity", "iot", "robotics"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IKTA/logo.png`
      },
      "IMIT": {
        name: "Інститут механічної інженерії та транспорту",
        nameKey: "faculty.lpnu.imit.name",
        majors: ["Галузеве машинобудування", "Транспортні технології", "Автомобільний транспорт"],
        majorKeys: ["major.mechanical-engineering", "major.transport-technologies", "major.automotive-transport"],
        interests: ["mechanical engineering", "transport", "logistics", "automotive"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IMIT/logo.png`
      },
      "IPMT": {
        name: "Інститут поліграфії та медійних технологій",
        nameKey: "faculty.lpnu.ipmt.name",
        majors: ["Видавництво та поліграфія", "Журналістика"],
        majorKeys: ["major.publishing-printing", "major.journalism"],
        interests: ["publishing", "media tech", "journalism", "printing"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IPMT/logo.png`
      },
      "IPPT": {
        name: "Інститут просторового планування та перспективних технологій",
        nameKey: "faculty.lpnu.ippt.name",
        majors: ["Комп'ютерні науки", "Економіка", "Геодезія"],
        majorKeys: ["major.computer-science", "major.economics", "major.geodesy"],
        interests: ["spatial planning", "technology", "development"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IPPT/logo.png`
      },
      "IPPO": {
        name: "Інститут права, психології та інноваційної освіти",
        nameKey: "faculty.lpnu.ippo.name",
        majors: ["Право", "Психологія", "Журналістика"],
        majorKeys: ["major.law", "major.psychology", "major.journalism"],
        interests: ["law", "psychology", "education", "legal"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IPPO/logo.png`
      },
      "IMFN": {
        name: "Інститут прикладної математики та фундаментальних наук",
        nameKey: "faculty.lpnu.imfn.name",
        majors: ["Прикладна математика", "Прикладна фізика", "Математика"],
        majorKeys: ["major.applied-mathematics", "major.applied-physics", "major.mathematics"],
        interests: ["mathematics", "physics", "fundamental sciences", "research"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IMFN/logo.png`
      },
      "ISTR": {
        name: "Інститут сталого розвитку імені В'ячеслава Чорновола",
        nameKey: "faculty.lpnu.istr.name",
        majors: ["Екологія", "Туризм", "Технології захисту навколишнього середовища"],
        majorKeys: ["major.ecology", "major.tourism", "major.environmental-protection"],
        interests: ["sustainable development", "ecology", "tourism"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/ISTR/logo.png`
      },
      "IHHT": {
        name: "Інститут хімії та хімічних технологій",
        nameKey: "faculty.lpnu.ihht.name",
        majors: ["Хімічні технології та інженерія", "Харчові технології", "Фармація"],
        majorKeys: ["major.chemical-engineering", "major.food-technology", "major.pharmacy"],
        interests: ["chemistry", "chemical engineering", "food tech", "pharmacy"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/IHHT/logo.png`
      },
      "MIOK": {
        name: "Міжнародний інститут освіти, культури та зв'язків з діаспорою",
        nameKey: "faculty.lpnu.miok.name",
        majors: ["Освітні та культурні програми"],
        majorKeys: ["major.educational-cultural-programs"],
        interests: ["education", "culture", "diaspora", "international connections"],
        logoPath: `${BLOB_BASE_PATH}/lpnu.ua/MIOK/logo.png`
      }
    }
  },

  // 5. Києво-Могилянська академія
  "ukma.edu.ua": {
    name: "Національний університет «Києво-Могилянська академія»",
    nameKey: "university.ukma.name",
    logoPath: `${BLOB_BASE_PATH}/ukma.edu.ua/logo.png`,
    faculties: {
      "FI": {
        name: "Факультет інформатики",
        nameKey: "faculty.ukma.fi.name",
        majors: ["Інженерія програмного забезпечення", "Комп'ютерні науки"],
        majorKeys: ["major.software-engineering", "major.computer-science"],
        interests: ["software engineering", "algorithms", "ai", "web development"],
        logoPath: `${BLOB_BASE_PATH}/ukma.edu.ua/FI/logo.png`
      },
      "FEN": {
        name: "Факультет економічних наук",
        nameKey: "faculty.ukma.fen.name",
        majors: ["Економіка", "Маркетинг", "Фінанси"],
        majorKeys: ["major.economics", "major.marketing", "major.finance"],
        interests: ["economics", "marketing", "startups", "analytics"],
        logoPath: `${BLOB_BASE_PATH}/ukma.edu.ua/FEN/logo.png`
      },
      "FSP": {
        name: "Факультет правничих наук",
        nameKey: "faculty.ukma.fsp.name",
        majors: ["Право"],
        majorKeys: ["major.law"],
        interests: ["legal", "debate", "human rights"],
        logoPath: `${BLOB_BASE_PATH}/ukma.edu.ua/FSP/logo.png`
      }
    }
  },

  // 6. Український католицький університет
  "ucu.edu.ua": {
    name: "Український католицький університет",
    nameKey: "university.ucu.name",
    logoPath: `${BLOB_BASE_PATH}/ucu.edu.ua/logo.png`,
    faculties: {
      "Theology": {
        name: "Богословсько-філософський факультет",
        nameKey: "faculty.ucu.theology.name",
        majors: ["Богослов'я", "Філософія"],
        majorKeys: ["major.theology", "major.philosophy"],
        interests: ["theology", "philosophy", "religion", "ethics"],
        logoPath: `${BLOB_BASE_PATH}/ucu.edu.ua/Theology/logo.png`
      },
      "Humanities": {
        name: "Гуманітарний факультет",
        nameKey: "faculty.ucu.humanities.name",
        majors: ["Історія", "Філологія", "Культурологія"],
        majorKeys: ["major.history", "major.philology", "major.cultural-studies"],
        interests: ["history", "linguistics", "culture", "literature"],
        logoPath: `${BLOB_BASE_PATH}/ucu.edu.ua/Humanities/logo.png`
      },
      "HealthSciences": {
        name: "Факультет наук про здоров'я",
        nameKey: "faculty.ucu.health-sciences.name",
        majors: ["Клінічна психологія", "Фізична терапія та ерготерапія"],
        majorKeys: ["major.clinical-psychology", "major.physical-therapy"],
        interests: ["health sciences", "psychology", "physical therapy", "healthcare"],
        logoPath: `${BLOB_BASE_PATH}/ucu.edu.ua/HealthSciences/logo.png`
      },
      "SocialSciences": {
        name: "Факультет суспільних наук",
        nameKey: "faculty.ucu.social-sciences.name",
        majors: ["Соціологія", "Соціальна робота", "Політологія"],
        majorKeys: ["major.sociology", "major.social-work", "major.political-science"],
        interests: ["social sciences", "sociology", "politics", "research"],
        logoPath: `${BLOB_BASE_PATH}/ucu.edu.ua/SocialSciences/logo.png`
      },
      "AppliedSciences": {
        name: "Факультет прикладних наук",
        nameKey: "faculty.ucu.applied-sciences.name",
        majors: ["Комп'ютерні науки", "ІТ та бізнес-аналітика", "Наука про дані"],
        majorKeys: ["major.computer-science", "major.it-business-analytics", "major.data-science"],
        interests: ["data science", "ai", "business analytics", "software engineering", "machine learning"],
        logoPath: `${BLOB_BASE_PATH}/ucu.edu.ua/AppliedSciences/logo.png`
      },
      "Law": {
        name: "Правничий факультет",
        nameKey: "faculty.ucu.law.name",
        majors: ["Право"],
        majorKeys: ["major.law"],
        interests: ["law", "legal", "human rights", "jurisprudence"],
        logoPath: `${BLOB_BASE_PATH}/ucu.edu.ua/Law/logo.png`
      },
      "BusinessSchool": {
        name: "Бізнес-школа УКУ",
        nameKey: "faculty.ucu.business-school.name",
        majors: ["Менеджмент", "Бізнес-адміністрування", "Інновації"],
        majorKeys: ["major.management", "major.business-administration", "major.innovations"],
        interests: ["business", "management", "entrepreneurship", "startups", "strategy"],
        logoPath: `${BLOB_BASE_PATH}/ucu.edu.ua/BusinessSchool/logo.png`
      }
    }
  },

  // 7. ХНУ ім. Каразіна
  "karazin.ua": {
    name: "ХНУ ім. В. Н. Каразіна",
    nameKey: "university.karazin.name",
    logoPath: `${BLOB_BASE_PATH}/karazin.ua/logo.png`,
    faculties: {
      "CS": {
        name: "Факультет комп'ютерних наук",
        nameKey: "faculty.karazin.cs.name",
        majors: ["Комп'ютерні науки", "Кібербезпека", "Комп'ютерна інженерія"],
        majorKeys: ["major.computer-science", "major.cybersecurity", "major.computer-engineering"],
        interests: ["programming", "cybersecurity", "algorithms", "networks"],
        logoPath: `${BLOB_BASE_PATH}/karazin.ua/CS/logo.png`
      },
      "Physics": {
        name: "Фізичний факультет",
        nameKey: "faculty.karazin.physics.name",
        majors: ["Фізика", "Астрономія", "Прикладна фізика"],
        majorKeys: ["major.physics", "major.astronomy", "major.applied-physics"],
        interests: ["quantum mechanics", "astronomy", "research", "physics"],
        logoPath: `${BLOB_BASE_PATH}/karazin.ua/Physics/logo.png`
      },
      "Econ": {
        name: "Економічний факультет",
        nameKey: "faculty.karazin.econ.name",
        majors: ["Економіка", "Міжнародні економічні відносини", "Фінанси"],
        majorKeys: ["major.economics", "major.international-economic-relations", "major.finance"],
        interests: ["economics", "finance", "international relations", "business"],
        logoPath: `${BLOB_BASE_PATH}/karazin.ua/Econ/logo.png`
      }
    }
  },

  // 8. НТУ ХПІ
  "kpi.kharkov.ua": {
    name: "НТУ «Харківський політехнічний інститут»",
    nameKey: "university.khpi.name",
    logoPath: `${BLOB_BASE_PATH}/kpi.kharkov.ua/logo.png`,
    faculties: {
      "KNTE": {
        name: "Навчально-науковий інститут комп'ютерних наук",
        nameKey: "faculty.khpi.knte.name",
        majors: ["Комп'ютерні науки", "Інформаційні системи та технології"],
        majorKeys: ["major.computer-science", "major.information-systems"],
        interests: ["programming", "web development", "databases", "ai"],
        logoPath: `${BLOB_BASE_PATH}/kpi.kharkov.ua/KNTE/logo.png`
      },
      "Mech": {
        name: "Навчально-науковий інститут механічної інженерії",
        nameKey: "faculty.khpi.mech.name",
        majors: ["Прикладна механіка", "Матеріалознавство", "Галузеве машинобудування"],
        majorKeys: ["major.applied-mechanics", "major.materials-science", "major.mechanical-engineering"],
        interests: ["cad", "manufacturing", "physics", "materials"],
        logoPath: `${BLOB_BASE_PATH}/kpi.kharkov.ua/Mech/logo.png`
      }
    }
  },

  // 9. СумДУ
  "sumdu.edu.ua": {
    name: "Сумський державний університет",
    nameKey: "university.sumdu.name",
    logoPath: `${BLOB_BASE_PATH}/sumdu.edu.ua/logo.png`,
    faculties: {
      "ELIT": {
        name: "Факультет електроніки та інформаційних технологій",
        nameKey: "faculty.sumdu.elit.name",
        majors: ["Комп'ютерні науки", "Кібербезпека", "Електроніка", "Прикладна математика"],
        majorKeys: ["major.computer-science", "major.cybersecurity", "major.electronics", "major.applied-mathematics"],
        interests: ["programming", "electronics", "cybersecurity", "ai", "mathematics"],
        logoPath: `${BLOB_BASE_PATH}/sumdu.edu.ua/ELIT/logo.png`
      },
      "BiEM": {
        name: "Навчально-науковий інститут бізнесу, економіки та менеджменту",
        nameKey: "faculty.sumdu.biem.name",
        majors: ["Економіка", "Менеджмент", "Маркетинг", "Міжнародні економічні відносини"],
        majorKeys: ["major.economics", "major.management", "major.marketing", "major.international-economic-relations"],
        interests: ["business", "marketing", "startups", "finance"],
        logoPath: `${BLOB_BASE_PATH}/sumdu.edu.ua/BiEM/logo.png`
      },
      "Med": {
        name: "Медичний інститут",
        nameKey: "faculty.sumdu.med.name",
        majors: ["Медицина", "Стоматологія", "Фізична терапія"],
        majorKeys: ["major.medicine", "major.dentistry", "major.physical-therapy"],
        interests: ["medicine", "anatomy", "research", "healthcare", "biology"],
        logoPath: `${BLOB_BASE_PATH}/sumdu.edu.ua/Med/logo.png`
      }
    }
  }
};

// Helper functions
export function getUniversityByDomain(email: string): UniversityRegistry | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  
  // Check exact match first
  if (UNIVERSITIES[domain]) {
    return UNIVERSITIES[domain];
  }
  
  // Check if domain ends with any university domain (for subdomains like student.kpi.ua)
  for (const [uniDomain, university] of Object.entries(UNIVERSITIES)) {
    if (domain.endsWith(uniDomain)) {
      return university;
    }
  }
  
  return null;
}

export function getUniversityDomain(email: string): string | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  
  if (UNIVERSITIES[domain]) {
    return domain;
  }
  
  for (const uniDomain of Object.keys(UNIVERSITIES)) {
    if (domain.endsWith(uniDomain)) {
      return uniDomain;
    }
  }
  
  return null;
}

export function isStudentEmail(email: string): boolean | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  
  // Known student subdomains  
  return true;
}

export function getFacultyByCode(universityDomain: string, facultyCode: string): FacultyRegistry | null {
  const university = UNIVERSITIES[universityDomain];
  if (!university) return null;
  
  return university.faculties[facultyCode] || null;
}

export function getAllUniversities(): Array<{ domain: string; university: UniversityRegistry }> {
  return Object.entries(UNIVERSITIES).map(([domain, university]) => ({
    domain,
    university
  }));
}

export function getAllFaculties(universityDomain: string): Array<{ code: string; faculty: FacultyRegistry }> {
  const university = UNIVERSITIES[universityDomain];
  if (!university) return [];
  
  return Object.entries(university.faculties).map(([code, faculty]) => ({
    code,
    faculty
  }));
}
