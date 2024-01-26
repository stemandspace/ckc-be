import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    firstname: Attribute.String;
    lastname: Attribute.String;
    grade: Attribute.String;
    parentname: Attribute.String;
    dob: Attribute.String;
    bio: Attribute.Text;
    notification_daily: Attribute.Boolean & Attribute.DefaultTo<true>;
    general_notification: Attribute.Boolean & Attribute.DefaultTo<true>;
    payment_notification: Attribute.Boolean & Attribute.DefaultTo<true>;
    referral_id: Attribute.UID;
    avatar: Attribute.String;
    banner: Attribute.Text;
    school_name: Attribute.String;
    address: Attribute.Text;
    private: Attribute.Boolean & Attribute.DefaultTo<false>;
    premium: Attribute.BigInteger;
    credits: Attribute.BigInteger &
      Attribute.SetMinMax<{
        min: '0';
      }> &
      Attribute.DefaultTo<'15'>;
    mobile: Attribute.BigInteger;
    level: Attribute.BigInteger;
    purchases: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::purchase.purchase'
    >;
    coins: Attribute.BigInteger &
      Attribute.SetMinMax<{
        min: '0';
      }> &
      Attribute.DefaultTo<'0'>;
    achivements: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::achivement.achivement'
    >;
    setup: Attribute.Boolean & Attribute.DefaultTo<false>;
    type: Attribute.Enumeration<['free', 'basic', 'premium']> &
      Attribute.DefaultTo<'free'>;
    country: Attribute.String;
    state: Attribute.String;
    city: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAchivementAchivement extends Schema.CollectionType {
  collectionName: 'achivements';
  info: {
    singularName: 'achivement';
    pluralName: 'achivements';
    displayName: 'Achivement';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    reward_id: Attribute.BigInteger;
    user: Attribute.Relation<
      'api::achivement.achivement',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    coins: Attribute.BigInteger;
    type: Attribute.Enumeration<
      [
        'video',
        'comic',
        'lean',
        'chllange',
        'quiz',
        'badge',
        'avatar',
        'banner'
      ]
    >;
    quiz_id: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::achivement.achivement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::achivement.achivement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBadgeBadge extends Schema.CollectionType {
  collectionName: 'badges';
  info: {
    singularName: 'badge';
    pluralName: 'badges';
    displayName: 'Badge';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    mediaUrl: Attribute.Text;
    isPremium: Attribute.Boolean;
    desc: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::badge.badge',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::badge.badge',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBannerBanner extends Schema.CollectionType {
  collectionName: 'banners';
  info: {
    singularName: 'banner';
    pluralName: 'banners';
    displayName: 'Banner';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    type: Attribute.Enumeration<['home', 'live', 'learn']>;
    mediaUrl: Attribute.Text;
    index: Attribute.Integer;
    name: Attribute.String;
    desc: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::banner.banner',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::banner.banner',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCarouselCarousel extends Schema.CollectionType {
  collectionName: 'carousels';
  info: {
    singularName: 'carousel';
    pluralName: 'carousels';
    displayName: 'Carousel';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    href: Attribute.UID;
    slides: Attribute.Component<'slides.slides', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::carousel.carousel',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::carousel.carousel',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChallangeWinnerChallangeWinner
  extends Schema.CollectionType {
  collectionName: 'challange_winners';
  info: {
    singularName: 'challange-winner';
    pluralName: 'challange-winners';
    displayName: 'Challange Winner';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user_id: Attribute.String;
    challenge_id: Attribute.String;
    reward_id: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::challange-winner.challange-winner',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::challange-winner.challange-winner',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChallengeChallenge extends Schema.CollectionType {
  collectionName: 'challenges';
  info: {
    singularName: 'challenge';
    pluralName: 'challenges';
    displayName: 'Challenge';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    grade: Attribute.String;
    banner: Attribute.Media & Attribute.Required;
    price: Attribute.BigInteger;
    premium: Attribute.Boolean;
    desc: Attribute.RichText;
    thumbnail: Attribute.Media & Attribute.Required;
    difficult: Attribute.Enumeration<['easy ', 'medium', 'hard']>;
    rewards: Attribute.Relation<
      'api::challenge.challenge',
      'oneToMany',
      'api::reward.reward'
    >;
    help_media: Attribute.Media;
    from: Attribute.Date;
    to: Attribute.Date;
    result: Attribute.Date;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::challenge.challenge',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::challenge.challenge',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiChallengeRequestChallengeRequest
  extends Schema.CollectionType {
  collectionName: 'challenge_requests';
  info: {
    singularName: 'challenge-request';
    pluralName: 'challenge-requests';
    displayName: 'Challenge Request';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    mediaUrl: Attribute.Text;
    status: Attribute.Enumeration<['pending', 'approved', 'rejected']>;
    challenge_id: Attribute.BigInteger;
    user: Attribute.Relation<
      'api::challenge-request.challenge-request',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    winner: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::challenge-request.challenge-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::challenge-request.challenge-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiComicComic extends Schema.CollectionType {
  collectionName: 'comics';
  info: {
    singularName: 'comic';
    pluralName: 'comics';
    displayName: 'Comic';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    published: Attribute.String;
    price: Attribute.BigInteger & Attribute.Required;
    mentor: Attribute.String;
    page_count: Attribute.BigInteger & Attribute.Required;
    thumbnail: Attribute.Media & Attribute.Required;
    content: Attribute.Text & Attribute.Required;
    desc: Attribute.RichText;
    quiz: Attribute.Relation<'api::comic.comic', 'oneToOne', 'api::quiz.quiz'>;
    grade: Attribute.String & Attribute.Required;
    tags: Attribute.String;
    premium: Attribute.Boolean;
    label: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::comic.comic',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::comic.comic',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCourseCourse extends Schema.CollectionType {
  collectionName: 'courses';
  info: {
    singularName: 'course';
    pluralName: 'courses';
    displayName: 'Course';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    price: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    premium: Attribute.Boolean & Attribute.DefaultTo<false>;
    thumbnail: Attribute.Media & Attribute.Required;
    trailer: Attribute.Text;
    content: Attribute.Text & Attribute.Required;
    modules: Attribute.Component<'module.module', true>;
    activity_modules: Attribute.Component<'activity-module.activiy-module'>;
    grade: Attribute.String & Attribute.Required;
    desc: Attribute.RichText;
    slug: Attribute.UID;
    mentor: Attribute.String;
    quiz: Attribute.Relation<
      'api::course.course',
      'oneToOne',
      'api::quiz.quiz'
    >;
    label: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::course.course',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::course.course',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDisconveryJarConfigDisconveryJarConfig
  extends Schema.CollectionType {
  collectionName: 'disconvery_jar_configs';
  info: {
    singularName: 'disconvery-jar-config';
    pluralName: 'disconvery-jar-configs';
    displayName: 'Discovery Jar Config';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    background_url: Attribute.String;
    theme_name: Attribute.String;
    discovery_jar_answers: Attribute.Relation<
      'api::disconvery-jar-config.disconvery-jar-config',
      'oneToMany',
      'api::discovery-jar-answer.discovery-jar-answer'
    >;
    discovery_jar_questions: Attribute.Relation<
      'api::disconvery-jar-config.disconvery-jar-config',
      'oneToMany',
      'api::discovery-jar-question.discovery-jar-question'
    >;
    slug: Attribute.UID;
    theme_color: Attribute.String;
    background: Attribute.Media;
    from: Attribute.Date;
    to: Attribute.Date;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::disconvery-jar-config.disconvery-jar-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::disconvery-jar-config.disconvery-jar-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDiscoveryJarAnswerDiscoveryJarAnswer
  extends Schema.CollectionType {
  collectionName: 'discovery_jar_answers';
  info: {
    singularName: 'discovery-jar-answer';
    pluralName: 'discovery-jar-answers';
    displayName: 'Discovery jar Answer';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    thumbnail: Attribute.Media & Attribute.Required;
    user_id: Attribute.String;
    mentor: Attribute.String;
    mediaUrl: Attribute.Text;
    tags: Attribute.JSON;
    time_stamps: Attribute.Component<'time-stamp.time-stamp', true>;
    discovery_jar_config: Attribute.Relation<
      'api::discovery-jar-answer.discovery-jar-answer',
      'manyToOne',
      'api::disconvery-jar-config.disconvery-jar-config'
    >;
    title: Attribute.String;
    desc: Attribute.Text;
    duration: Attribute.String;
    discovery_jar_questions: Attribute.Relation<
      'api::discovery-jar-answer.discovery-jar-answer',
      'oneToMany',
      'api::discovery-jar-question.discovery-jar-question'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::discovery-jar-answer.discovery-jar-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::discovery-jar-answer.discovery-jar-answer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDiscoveryJarQuestionDiscoveryJarQuestion
  extends Schema.CollectionType {
  collectionName: 'discovery_jar_questions';
  info: {
    singularName: 'discovery-jar-question';
    pluralName: 'discovery-jar-questions';
    displayName: 'Discovery jar Question';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    question: Attribute.Text;
    mediaUrl: Attribute.Text;
    discovery_jar_config: Attribute.Relation<
      'api::discovery-jar-question.discovery-jar-question',
      'manyToOne',
      'api::disconvery-jar-config.disconvery-jar-config'
    >;
    discovery_jar_answer: Attribute.Relation<
      'api::discovery-jar-question.discovery-jar-question',
      'manyToOne',
      'api::discovery-jar-answer.discovery-jar-answer'
    >;
    user: Attribute.Relation<
      'api::discovery-jar-question.discovery-jar-question',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    upload: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::discovery-jar-question.discovery-jar-question',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::discovery-jar-question.discovery-jar-question',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHowItWorkHowItWork extends Schema.CollectionType {
  collectionName: 'how_it_works';
  info: {
    singularName: 'how-it-work';
    pluralName: 'how-it-works';
    displayName: 'How-it-work';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    thumbnail: Attribute.Media & Attribute.Required;
    title: Attribute.String;
    desc: Attribute.RichText;
    duration: Attribute.BigInteger;
    grade: Attribute.String;
    mentor: Attribute.String;
    slug: Attribute.UID<'api::how-it-work.how-it-work', 'title'>;
    mediaUrl: Attribute.String;
    tags: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::how-it-work.how-it-work',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::how-it-work.how-it-work',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLiveLive extends Schema.CollectionType {
  collectionName: 'lives';
  info: {
    singularName: 'live';
    pluralName: 'lives';
    displayName: 'Live';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    thumbnail: Attribute.Media & Attribute.Required;
    mediaUrl: Attribute.String;
    tags: Attribute.String;
    premium: Attribute.Boolean;
    grade: Attribute.String;
    price: Attribute.BigInteger;
    slug: Attribute.UID;
    mentor: Attribute.String;
    content: Attribute.String;
    duration: Attribute.BigInteger;
    desc: Attribute.RichText;
    title: Attribute.String;
    type: Attribute.Enumeration<['live', 'upcoming', 'recorded']>;
    rewards: Attribute.Relation<
      'api::live.live',
      'oneToMany',
      'api::reward.reward'
    >;
    from: Attribute.DateTime;
    to: Attribute.DateTime;
    label: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::live.live', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::live.live', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiNacNac extends Schema.CollectionType {
  collectionName: 'nacs';
  info: {
    singularName: 'nac';
    pluralName: 'nacs';
    displayName: 'Nac';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    thumbnail: Attribute.Media & Attribute.Required;
    title: Attribute.String;
    desc: Attribute.RichText;
    price: Attribute.Decimal;
    premium: Attribute.Boolean;
    duration: Attribute.BigInteger;
    grade: Attribute.String;
    mentor: Attribute.String;
    content: Attribute.String;
    tags: Attribute.String;
    quiz: Attribute.Relation<'api::nac.nac', 'oneToOne', 'api::quiz.quiz'>;
    page_count: Attribute.BigInteger;
    label: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::nac.nac', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::nac.nac', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPlanPlan extends Schema.CollectionType {
  collectionName: 'plans';
  info: {
    singularName: 'plan';
    pluralName: 'plans';
    displayName: 'Plan';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    desc: Attribute.Text;
    content: Attribute.RichText;
    duration_days: Attribute.BigInteger;
    price: Attribute.Decimal;
    thumbnail: Attribute.Media & Attribute.Required;
    rewards: Attribute.Relation<
      'api::plan.plan',
      'oneToMany',
      'api::reward.reward'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::plan.plan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::plan.plan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiProductProduct extends Schema.CollectionType {
  collectionName: 'products';
  info: {
    singularName: 'product';
    pluralName: 'products';
    displayName: 'Virtual Product';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 15;
      }>;
    slug: Attribute.UID<'api::product.product', 'title'>;
    coins: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    type: Attribute.Enumeration<['avatar', 'banner']> &
      Attribute.Required &
      Attribute.DefaultTo<'avatar'>;
    images: Attribute.Media & Attribute.Required;
    premium: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPromocodePromocode extends Schema.CollectionType {
  collectionName: 'promocodes';
  info: {
    singularName: 'promocode';
    pluralName: 'promocodes';
    displayName: 'promocode';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    promocode: Attribute.String;
    from: Attribute.Date;
    to: Attribute.Date;
    users: Attribute.Relation<
      'api::promocode.promocode',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    type: Attribute.Enumeration<['flat', 'percentage']>;
    value: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::promocode.promocode',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::promocode.promocode',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPromocodeUsagePromocodeUsage extends Schema.CollectionType {
  collectionName: 'promocode_usages';
  info: {
    singularName: 'promocode-usage';
    pluralName: 'promocode-usages';
    displayName: 'promocode_usage';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    promocode: Attribute.String;
    userId: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::promocode-usage.promocode-usage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::promocode-usage.promocode-usage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPurchasePurchase extends Schema.CollectionType {
  collectionName: 'purchases';
  info: {
    singularName: 'purchase';
    pluralName: 'purchases';
    displayName: 'Purchase';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content_id: Attribute.BigInteger;
    user_id: Attribute.String;
    purchase_id: Attribute.String;
    purchase_date: Attribute.String;
    amount: Attribute.Decimal;
    status: Attribute.Enumeration<['paid', 'pending', 'unpaid', 'failed']>;
    user: Attribute.Relation<
      'api::purchase.purchase',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    label: Attribute.String;
    type: Attribute.Enumeration<
      ['course', 'video', 'comic', 'live', 'jar', 'challange']
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::purchase.purchase',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::purchase.purchase',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQlistQlist extends Schema.CollectionType {
  collectionName: 'qlists';
  info: {
    singularName: 'qlist';
    pluralName: 'qlists';
    displayName: 'Qlist';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    desc: Attribute.RichText;
    qlides: Attribute.Component<'qlide.qlide', true>;
    visible: Attribute.Integer;
    reward: Attribute.Relation<
      'api::qlist.qlist',
      'oneToOne',
      'api::reward.reward'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::qlist.qlist',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::qlist.qlist',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiQuizQuiz extends Schema.CollectionType {
  collectionName: 'quizzes';
  info: {
    singularName: 'quiz';
    pluralName: 'quizzes';
    displayName: 'Quiz';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    desc: Attribute.RichText;
    qlides: Attribute.Component<'qlide.qlide', true> & Attribute.Required;
    visible: Attribute.Integer & Attribute.Required;
    reward: Attribute.Relation<
      'api::quiz.quiz',
      'oneToOne',
      'api::reward.reward'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::quiz.quiz', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::quiz.quiz', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiQuizConfigQuizConfig extends Schema.SingleType {
  collectionName: 'quiz_configs';
  info: {
    singularName: 'quiz-config';
    pluralName: 'quiz-configs';
    displayName: 'Quiz Config';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    background: Attribute.Text;
    quizzes: Attribute.Relation<
      'api::quiz-config.quiz-config',
      'oneToMany',
      'api::quiz.quiz'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::quiz-config.quiz-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::quiz-config.quiz-config',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRealPurchaseRealPurchase extends Schema.CollectionType {
  collectionName: 'real_purchases';
  info: {
    singularName: 'real-purchase';
    pluralName: 'real-purchases';
    displayName: 'Real Purchase';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user_id: Attribute.String;
    purchase_id: Attribute.String;
    amount: Attribute.Decimal;
    status: Attribute.Enumeration<['paid', 'pending', 'unpaid', 'failed']>;
    label: Attribute.String;
    type: Attribute.Enumeration<['credits', 'diamonds', 'premium']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::real-purchase.real-purchase',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::real-purchase.real-purchase',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRecordedLiveRecordedLive extends Schema.CollectionType {
  collectionName: 'recorded_lives';
  info: {
    singularName: 'recorded-live';
    pluralName: 'recorded-lives';
    displayName: 'Recorded Live';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    thumbnail: Attribute.Text;
    premium: Attribute.Boolean;
    grade: Attribute.String;
    price: Attribute.BigInteger;
    slug: Attribute.UID;
    mentor: Attribute.String;
    content: Attribute.String;
    duration: Attribute.BigInteger;
    desc: Attribute.RichText;
    end_timestamp: Attribute.BigInteger;
    start_timestamp: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::recorded-live.recorded-live',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::recorded-live.recorded-live',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReferralReferral extends Schema.CollectionType {
  collectionName: 'referrals';
  info: {
    singularName: 'referral';
    pluralName: 'referrals';
    displayName: 'Referral';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    referring_user_id: Attribute.String;
    referred_user_id: Attribute.String;
    referral_code_used: Attribute.String;
    reward_points: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::referral.referral',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::referral.referral',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRewardReward extends Schema.CollectionType {
  collectionName: 'rewards';
  info: {
    singularName: 'reward';
    pluralName: 'rewards';
    displayName: 'Reward';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    reward_id: Attribute.String;
    title: Attribute.String;
    description: Attribute.Text;
    type: Attribute.Enumeration<['coins', 'bedge', 'avatar', 'certificate']>;
    value: Attribute.String;
    content_id: Attribute.String;
    video: Attribute.Relation<
      'api::reward.reward',
      'manyToOne',
      'api::video.video'
    >;
    live: Attribute.Relation<
      'api::reward.reward',
      'manyToOne',
      'api::live.live'
    >;
    challenge: Attribute.Relation<
      'api::reward.reward',
      'manyToOne',
      'api::challenge.challenge'
    >;
    plan: Attribute.Relation<
      'api::reward.reward',
      'manyToOne',
      'api::plan.plan'
    >;
    quiz: Attribute.Relation<
      'api::reward.reward',
      'oneToOne',
      'api::quiz.quiz'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::reward.reward',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::reward.reward',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSubscriptionSubscription extends Schema.CollectionType {
  collectionName: 'subscriptions';
  info: {
    singularName: 'subscription';
    pluralName: 'subscriptions';
    displayName: 'Subscription';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    tsxid: Attribute.String;
    user_id: Attribute.BigInteger;
    plan: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'api::plan.plan'
    >;
    end_stamp: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::subscription.subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTopUpTopUp extends Schema.CollectionType {
  collectionName: 'top_ups';
  info: {
    singularName: 'top-up';
    pluralName: 'top-ups';
    displayName: 'Top Up';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    desc: Attribute.Text;
    thumbnail: Attribute.Text;
    credits: Attribute.BigInteger;
    INR: Attribute.BigInteger;
    USD: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::top-up.top-up',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::top-up.top-up',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUpcomingLiveUpcomingLive extends Schema.CollectionType {
  collectionName: 'upcoming_lives';
  info: {
    singularName: 'upcoming-live';
    pluralName: 'upcoming-lives';
    displayName: 'Upcoming Live';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    thumbnail: Attribute.Text;
    premium: Attribute.Boolean;
    grade: Attribute.String;
    price: Attribute.BigInteger;
    slug: Attribute.UID;
    mentor: Attribute.String;
    content: Attribute.String;
    duration: Attribute.BigInteger;
    desc: Attribute.RichText;
    end_timestamp: Attribute.BigInteger;
    start_timestamp: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::upcoming-live.upcoming-live',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::upcoming-live.upcoming-live',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiVideoVideo extends Schema.CollectionType {
  collectionName: 'videos';
  info: {
    singularName: 'video';
    pluralName: 'videos';
    displayName: 'Video';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    desc: Attribute.RichText & Attribute.Required;
    price: Attribute.Decimal & Attribute.Required;
    premium: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    duration: Attribute.BigInteger;
    grade: Attribute.String;
    mentor: Attribute.String;
    slug: Attribute.UID<'api::video.video', 'title'> & Attribute.Required;
    mediaUrl: Attribute.String & Attribute.Required;
    tags: Attribute.String;
    rewards: Attribute.Relation<
      'api::video.video',
      'oneToMany',
      'api::reward.reward'
    >;
    thumbnail: Attribute.Media & Attribute.Required;
    quiz: Attribute.Relation<'api::video.video', 'oneToOne', 'api::quiz.quiz'>;
    label: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::video.video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::video.video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWatchedWatched extends Schema.CollectionType {
  collectionName: 'watcheds';
  info: {
    singularName: 'watched';
    pluralName: 'watcheds';
    displayName: 'Watched';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    course_id: Attribute.String;
    content_id: Attribute.String;
    watched_date: Attribute.String;
    type: Attribute.Enumeration<['course', 'module', 'video', 'comic', 'live']>;
    watch_progress: Attribute.BigInteger;
    completed: Attribute.Boolean & Attribute.DefaultTo<false>;
    user_id: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::watched.watched',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::watched.watched',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::achivement.achivement': ApiAchivementAchivement;
      'api::badge.badge': ApiBadgeBadge;
      'api::banner.banner': ApiBannerBanner;
      'api::carousel.carousel': ApiCarouselCarousel;
      'api::challange-winner.challange-winner': ApiChallangeWinnerChallangeWinner;
      'api::challenge.challenge': ApiChallengeChallenge;
      'api::challenge-request.challenge-request': ApiChallengeRequestChallengeRequest;
      'api::comic.comic': ApiComicComic;
      'api::course.course': ApiCourseCourse;
      'api::disconvery-jar-config.disconvery-jar-config': ApiDisconveryJarConfigDisconveryJarConfig;
      'api::discovery-jar-answer.discovery-jar-answer': ApiDiscoveryJarAnswerDiscoveryJarAnswer;
      'api::discovery-jar-question.discovery-jar-question': ApiDiscoveryJarQuestionDiscoveryJarQuestion;
      'api::how-it-work.how-it-work': ApiHowItWorkHowItWork;
      'api::live.live': ApiLiveLive;
      'api::nac.nac': ApiNacNac;
      'api::plan.plan': ApiPlanPlan;
      'api::product.product': ApiProductProduct;
      'api::promocode.promocode': ApiPromocodePromocode;
      'api::promocode-usage.promocode-usage': ApiPromocodeUsagePromocodeUsage;
      'api::purchase.purchase': ApiPurchasePurchase;
      'api::qlist.qlist': ApiQlistQlist;
      'api::quiz.quiz': ApiQuizQuiz;
      'api::quiz-config.quiz-config': ApiQuizConfigQuizConfig;
      'api::real-purchase.real-purchase': ApiRealPurchaseRealPurchase;
      'api::recorded-live.recorded-live': ApiRecordedLiveRecordedLive;
      'api::referral.referral': ApiReferralReferral;
      'api::reward.reward': ApiRewardReward;
      'api::subscription.subscription': ApiSubscriptionSubscription;
      'api::top-up.top-up': ApiTopUpTopUp;
      'api::upcoming-live.upcoming-live': ApiUpcomingLiveUpcomingLive;
      'api::video.video': ApiVideoVideo;
      'api::watched.watched': ApiWatchedWatched;
    }
  }
}
