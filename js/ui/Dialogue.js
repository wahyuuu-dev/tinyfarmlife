// Panel percakapan NPC. Seluruh teks dibuat lewat textContent agar aman dari markup tak tepercaya.
const DIALOGUES = {
  Mira: {
    title: 'Mira', role: 'Penjaga pasar',
    greeting: 'Hai! Senang melihatmu datang ke desa. Ada yang ingin kamu tanyakan?',
    choices: [
      ['Apa kabar pasar?', 'Pasar desa sekarang sudah beroperasi! Kamu bisa menjual hasil panen di kios ini. Untuk membeli benih dan perlengkapan, kunjungi Toko Kebun dekat rumahmu. Terima kasih sudah ikut menghidupkan desa.'],
      ['Bagaimana kehidupan desa?', 'Greenfield Village memang kecil, tetapi warganya saling membantu. Kalau kamu sering mampir, kamu akan mengenal banyak hal tentang desa ini.'],
      ['Ada tips untuk berkebun?', 'Jangan lupa menyiram tanaman. Saat hujan turun, air hujan juga membantu menyiram tanaman di kebunmu.']
    ]
  },
  Bima: {
    title: 'Bima', role: 'Warga desa',
    greeting: 'Halo, teman! Aku Bima. Biasanya aku membantu warga dan mengambil air dari sumur.',
    choices: [
      ['Apa yang sedang kamu kerjakan?', 'Aku membantu warga dan menjaga sumur desa. Kalau energimu berkurang, gunakan sumur untuk memulihkan 15 energi. Sumur hanya bisa dipakai sekali sehari.'],
      ['Di mana letak Home Farm?', 'Ikuti jalan setapak ke arah timur dari desa. Kamu akan menemukan jalan pulang menuju kebunmu.'],
      ['Ceritakan tentang desa ini.', 'Desa ini tumbuh sedikit demi sedikit. Kami berharap semakin banyak orang datang dan ikut meramaikannya.']
    ]
  }
};

export class Dialogue {
  constructor(root) {
    this.root = root;
    this.name = root.querySelector('#dialogueName');
    this.role = root.querySelector('#dialogueRole');
    this.message = root.querySelector('#dialogueMessage');
    this.choices = root.querySelector('#dialogueChoices');
    this.closeButton = root.querySelector('#dialogueClose');
    this.onClose = null;
    this.script = null;
    this.onQuestAction = null;
    this.getQuestAction = null;
    this.getSocialActions = null;
    this.getSocialStatus = null;
    this.currentNpc = null;
    this.closeButton.addEventListener('click', () => this.close());
    root.addEventListener('click', (e) => { if (e.target === root) this.close(); });
  }

  open(npc, onClose, onQuestAction = null, getQuestAction = null, getSocialActions = null, getSocialStatus = null) {
    this.script = DIALOGUES[npc?.name] || {
      title: npc?.name || 'Warga desa', role: npc?.role || 'Warga desa',
      greeting: 'Halo! Senang bertemu denganmu.', choices: [['Sampai jumpa.', 'Senang bisa berbincang denganmu!']]
    };
    this.onClose = onClose;
    this.onQuestAction = onQuestAction;
    this.getQuestAction = getQuestAction;
    this.getSocialActions = getSocialActions;
    this.getSocialStatus = getSocialStatus;
    this.currentNpc = npc?.name || '';
    this.name.textContent = this.script.title;
    const activity = npc?.activity ? ` · ${npc.activity}` : '';
    this.activityLabel = activity;
    this.updateRole();
    this.showMessage(this.script.greeting, true);
    this.root.classList.remove('hidden');
    this.root.setAttribute('aria-hidden', 'false');
  }

  updateRole() {
    const socialStatus = this.getSocialStatus ? this.getSocialStatus() : '';
    this.role.textContent = [this.script.role, socialStatus, this.activityLabel].filter(Boolean).join('  |  ');
  }

  showMessage(message, showChoices = false) {
    this.updateRole();
    this.message.textContent = message;
    this.choices.replaceChildren();
    if (showChoices) {
      for (const [label, reply] of this.script.choices) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'dialogue-choice'; button.textContent = label;
        button.addEventListener('click', () => this.showMessage(reply, false));
        this.choices.append(button);
      }
    } else {
      const back = document.createElement('button');
      back.type = 'button'; back.className = 'dialogue-choice'; back.textContent = 'Tanya hal lain';
      back.addEventListener('click', () => this.showMessage(this.script.greeting, true));
      this.choices.append(back);
    }
    const quest = this.getQuestAction ? this.getQuestAction() : null;
    if (quest) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'dialogue-choice quest-choice'; button.textContent = quest.label;
      button.addEventListener('click', () => {
        const result = this.onQuestAction ? this.onQuestAction(this.currentNpc) : quest.detail;
        this.showMessage(result || quest.detail, true);
      });
      this.choices.append(button);
    }
    const social = this.getSocialActions ? this.getSocialActions() : [];
    for (const action of social) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'dialogue-choice social-choice';
      button.textContent = action.label; button.disabled = !!action.disabled;
      if (!action.disabled) button.addEventListener('click', () => this.showMessage(action.run(), false));
      this.choices.append(button);
    }
  }

  close() {
    if (this.root.classList.contains('hidden')) return;
    this.root.classList.add('hidden');
    this.root.setAttribute('aria-hidden', 'true');
    const callback = this.onClose; this.onClose = null; this.onQuestAction = null; this.getQuestAction = null; this.getSocialActions = null; this.getSocialStatus = null; this.currentNpc = null;
    if (callback) callback();
  }
}
