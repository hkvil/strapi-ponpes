import type { Schema, Struct } from '@strapi/strapi';

export interface KontakKontak extends Struct.ComponentSchema {
  collectionName: 'components_kontak_kontaks';
  info: {
    displayName: 'kontakItem';
  };
  attributes: {
    jenis: Schema.Attribute.Enumeration<
      [
        'telp',
        'youtube',
        'facebook',
        'twitter',
        'line',
        'whatsapp',
        'instagram',
      ]
    >;
    order: Schema.Attribute.Integer;
    value: Schema.Attribute.String;
  };
}

export interface ProfilBerita extends Struct.ComponentSchema {
  collectionName: 'components_profil_beritas';
  info: {
    displayName: 'informasi';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    thubmnail: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface ProfilFiles extends Struct.ComponentSchema {
  collectionName: 'components_profil_files';
  info: {
    displayName: 'files';
  };
  attributes: {};
}

export interface ProfilImageItem extends Struct.ComponentSchema {
  collectionName: 'components_profil_image_items';
  info: {
    displayName: 'imageItem';
  };
  attributes: {
    date: Schema.Attribute.Date;
    desc: Schema.Attribute.Text;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    order: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

export interface ProfilProfil extends Struct.ComponentSchema {
  collectionName: 'components_profil_profils';
  info: {
    displayName: 'profil';
  };
  attributes: {};
}

export interface ProfilVideoItem extends Struct.ComponentSchema {
  collectionName: 'components_profil_video_items';
  info: {
    displayName: 'videoItem';
  };
  attributes: {
    date: Schema.Attribute.Date;
    desc: Schema.Attribute.Text;
    order: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String;
  };
}

export interface ProgramKerjaProgramKerja extends Struct.ComponentSchema {
  collectionName: 'components_program_kerja_program_kerjas';
  info: {
    displayName: 'program kerja';
  };
  attributes: {
    program_kerja: Schema.Attribute.RichText;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'kontak.kontak': KontakKontak;
      'profil.berita': ProfilBerita;
      'profil.files': ProfilFiles;
      'profil.image-item': ProfilImageItem;
      'profil.profil': ProfilProfil;
      'profil.video-item': ProfilVideoItem;
      'program-kerja.program-kerja': ProgramKerjaProgramKerja;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
