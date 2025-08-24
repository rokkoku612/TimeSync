export interface CopyTemplate {
  id: string;
  nameJa: string;
  nameEn: string;
  beforeTextJa: string;
  beforeTextEn: string;
  afterTextJa: string;
  afterTextEn: string;
  isCustom?: boolean;
}


export const copyTemplates: CopyTemplate[] = [
  {
    id: 'simple',
    nameJa: 'シンプル（日程のみ）',
    nameEn: 'Simple (Dates Only)',
    beforeTextJa: '',
    beforeTextEn: '',
    afterTextJa: '',
    afterTextEn: ''
  },
  {
    id: 'formal',
    nameJa: 'フォーマル',
    nameEn: 'Formal',
    beforeTextJa: 'お忙しいところ恐れ入りますが、以下の日程よりご都合のよろしい時間帯をお選びいただけますでしょうか。\n\n【候補日時】',
    beforeTextEn: 'Thank you for your time. Please select your preferred time slot from the following available dates:\n\n[Available Time Slots]',
    afterTextJa: '\n\n上記の中から、ご都合のよろしい日時をお知らせください。\nどうぞよろしくお願いいたします。',
    afterTextEn: '\n\nPlease let me know which time works best for you.\nThank you for your cooperation.'
  },
  {
    id: 'casual',
    nameJa: 'カジュアル',
    nameEn: 'Casual',
    beforeTextJa: 'ミーティングの日程調整をさせてください！\n以下の時間帯で空いています：\n',
    beforeTextEn: 'Let\'s schedule our meeting!\nI\'m available at these times:\n',
    afterTextJa: '\n\n都合の良い時間を教えてください！',
    afterTextEn: '\n\nLet me know what works for you!'
  },
  {
    id: 'business',
    nameJa: 'ビジネス',
    nameEn: 'Business',
    beforeTextJa: 'お世話になっております。\n\n打ち合わせの日程調整をさせていただきたく、下記の通り候補日時をご提案いたします。\n\n────────\n◆ 候補日時\n────────',
    beforeTextEn: 'Dear [Name],\n\nI would like to schedule a meeting with you. Please find my availability below:\n\n────────\n◆ Available Time Slots\n────────',
    afterTextJa: '\n────────\n\n上記日程でご都合はいかがでしょうか。\nご確認のほど、よろしくお願いいたします。',
    afterTextEn: '\n────────\n\nPlease let me know if any of these times work for you.\nLooking forward to your response.'
  },
  {
    id: 'interview',
    nameJa: '面接・面談',
    nameEn: 'Interview',
    beforeTextJa: 'この度は面接（面談）の機会をいただき、誠にありがとうございます。\n\n面接日程について、以下の時間帯で対応可能です：\n',
    beforeTextEn: 'Thank you for the interview opportunity.\n\nI am available for the interview at the following times:\n',
    afterTextJa: '\n\nご都合のよろしい日時をお選びいただければ幸いです。\n何卒よろしくお願い申し上げます。',
    afterTextEn: '\n\nPlease select the time that works best for you.\nThank you for your consideration.'
  },
  {
    id: 'reminder',
    nameJa: 'リマインダー付き',
    nameEn: 'With Reminder',
    beforeTextJa: '【日程調整のお願い】\n\n先日お話しした件について、打ち合わせの日程を調整させていただければと思います。\n\n私の空き時間：',
    beforeTextEn: '[Meeting Request]\n\nRegarding our previous discussion, I would like to schedule a meeting.\n\nMy availability:',
    afterTextJa: '\n\n※オンライン/対面どちらでも対応可能です\n※所要時間：約1時間を予定しております\n\nご検討のほど、よろしくお願いいたします。',
    afterTextEn: '\n\n* Available for both online and in-person meetings\n* Duration: Approximately 1 hour\n\nPlease let me know your preference.'
  },
  {
    id: 'quick',
    nameJa: 'クイック調整',
    nameEn: 'Quick Schedule',
    beforeTextJa: '空いてる時間：\n',
    beforeTextEn: 'Free slots:\n',
    afterTextJa: '\n\nどれか選んでください！',
    afterTextEn: '\n\nPick one!'
  },
  {
    id: 'international',
    nameJa: '国際会議',
    nameEn: 'International',
    beforeTextJa: '国際会議の日程調整をお願いいたします。\n\n【日本時間での候補】',
    beforeTextEn: 'Let\'s coordinate our international meeting.\n\n[Available times in JST (Japan Standard Time)]',
    afterTextJa: '\n\n※時差にご注意ください\n※必要に応じて他のタイムゾーンでの時刻もお知らせいたします',
    afterTextEn: '\n\n* Please note the time zone difference\n* I can provide times in your timezone if needed'
  }
];

export const getDefaultTemplate = (): string => {
  const saved = localStorage.getItem('selectedCopyTemplate');
  return saved || 'simple';
};

export const saveSelectedTemplate = (templateId: string): void => {
  localStorage.setItem('selectedCopyTemplate', templateId);
};

// カスタムテンプレート管理
export const getCustomTemplates = (): CopyTemplate[] => {
  const saved = localStorage.getItem('customTemplates');
  return saved ? JSON.parse(saved) : [];
};

export const saveCustomTemplate = (template: CopyTemplate): void => {
  const customTemplates = getCustomTemplates();
  const existingIndex = customTemplates.findIndex(t => t.id === template.id);
  
  if (existingIndex !== -1) {
    customTemplates[existingIndex] = template;
  } else {
    customTemplates.push(template);
  }
  
  localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
};

export const deleteCustomTemplate = (templateId: string): void => {
  const customTemplates = getCustomTemplates().filter(t => t.id !== templateId);
  localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
};

export const getAllTemplates = (): CopyTemplate[] => {
  return [...copyTemplates, ...getCustomTemplates()];
};