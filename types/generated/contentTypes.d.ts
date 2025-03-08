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
    lastlogin: Attribute.DateTime;
    notification_token: Attribute.String;
    whatsapp_notification: Attribute.Boolean;
    info_review_date: Attribute.Date;
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
    contentId: Attribute.BigInteger;
    user: Attribute.Relation<
      'api::achivement.achivement',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    transectionAmount: Attribute.BigInteger;
    transectionType: Attribute.Enumeration<['cr', 'dr']>;
    contentType: Attribute.Enumeration<
      [
        'quiz',
        'banner',
        'avatar',
        'certificate',
        'badge',
        'coins',
        'bannar',
        'referral',
        'credit'
      ]
    >;
    label: Attribute.String;
    rewardId: Attribute.BigInteger;
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

export interface ApiActivityRequestActivityRequest
  extends Schema.CollectionType {
  collectionName: 'activity_requests';
  info: {
    singularName: 'activity-request';
    pluralName: 'activity-requests';
    displayName: 'Activity Request';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    courseId: Attribute.BigInteger;
    winner: Attribute.Boolean;
    status: Attribute.Enumeration<['approved', 'pending', 'rejected']>;
    media: Attribute.Media;
    user: Attribute.Relation<
      'api::activity-request.activity-request',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::activity-request.activity-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::activity-request.activity-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAvatarAvatar extends Schema.CollectionType {
  collectionName: 'avatars';
  info: {
    singularName: 'avatar';
    pluralName: 'avatars';
    displayName: 'avatar';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    media: Attribute.Media;
    desc: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::avatar.avatar',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::avatar.avatar',
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
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    desc: Attribute.Text;
    media: Attribute.Media;
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

export interface ApiBannarBannar extends Schema.CollectionType {
  collectionName: 'bannars';
  info: {
    singularName: 'bannar';
    pluralName: 'bannars';
    displayName: 'Bannar';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    media: Attribute.Media;
    desc: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::bannar.bannar',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::bannar.bannar',
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

export interface ApiCertificateCertificate extends Schema.CollectionType {
  collectionName: 'certificates';
  info: {
    singularName: 'certificate';
    pluralName: 'certificates';
    displayName: 'Certificate';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    desc: Attribute.String & Attribute.Required;
    media: Attribute.Media & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::certificate.certificate',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::certificate.certificate',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCertificationCertification extends Schema.SingleType {
  collectionName: 'certifications';
  info: {
    singularName: 'certification';
    pluralName: 'certifications';
    displayName: 'Certification';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    banner: Attribute.Media;
    title: Attribute.String;
    desc: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::certification.certification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::certification.certification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCertificationEventCertificationEvent
  extends Schema.CollectionType {
  collectionName: 'certification_events';
  info: {
    singularName: 'certification-event';
    pluralName: 'certification-events';
    displayName: 'Certification Program';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    desc: Attribute.Text;
    school: Attribute.String;
    direct: Attribute.String;
    year: Attribute.String;
    month: Attribute.String;
    grades: Attribute.String;
    banner: Attribute.Media;
    certificate: Attribute.Component<'certification.certification-config'>;
    resultdata: Attribute.JSON;
    startDate: Attribute.Date;
    endDate: Attribute.Date;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::certification-event.certification-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::certification-event.certification-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCertificationEventModuleCertificationEventModule
  extends Schema.CollectionType {
  collectionName: 'certification_event_modules';
  info: {
    singularName: 'certification-event-module';
    pluralName: 'certification-event-modules';
    displayName: 'Certification Event Module';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.Text;
    desc: Attribute.Text;
    thumbnail: Attribute.Media;
    url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::certification-event-module.certification-event-module',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::certification-event-module.certification-event-module',
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
    help_media: Attribute.Media;
    from: Attribute.Date;
    to: Attribute.Date;
    result: Attribute.Date;
    winner_reward: Attribute.Relation<
      'api::challenge.challenge',
      'oneToMany',
      'api::reward.reward'
    >;
    rewards: Attribute.Relation<
      'api::challenge.challenge',
      'manyToMany',
      'api::reward.reward'
    >;
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
    status: Attribute.Enumeration<['pending', 'approved', 'rejected']>;
    challengeId: Attribute.BigInteger;
    user: Attribute.Relation<
      'api::challenge-request.challenge-request',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    winner: Attribute.Boolean & Attribute.DefaultTo<false>;
    media: Attribute.Media;
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
    new: Attribute.Boolean & Attribute.DefaultTo<false>;
    trending: Attribute.Boolean & Attribute.DefaultTo<false>;
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

export interface ApiComicBookComicBook extends Schema.CollectionType {
  collectionName: 'comic_books';
  info: {
    singularName: 'comic-book';
    pluralName: 'comic-books';
    displayName: 'comic-book';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    address: Attribute.String;
    city: Attribute.String;
    state: Attribute.String;
    zip: Attribute.String;
    mobile: Attribute.String;
    email: Attribute.String;
    landmark: Attribute.String;
    paymentId: Attribute.String;
    submissionId: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::comic-book.comic-book',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::comic-book.comic-book',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiControlControl extends Schema.SingleType {
  collectionName: 'controls';
  info: {
    singularName: 'control';
    pluralName: 'controls';
    displayName: 'Control';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    payments: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::control.control',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::control.control',
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
    trending: Attribute.Boolean & Attribute.DefaultTo<false>;
    new: Attribute.Boolean & Attribute.DefaultTo<false>;
    tags: Attribute.String;
    rewards: Attribute.Relation<
      'api::course.course',
      'manyToMany',
      'api::reward.reward'
    >;
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

export interface ApiCreditAccountCreditAccount extends Schema.CollectionType {
  collectionName: 'credit_accounts';
  info: {
    singularName: 'credit-account';
    pluralName: 'credit-accounts';
    displayName: 'Credit Account';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user: Attribute.Relation<
      'api::credit-account.credit-account',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    credits: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::credit-account.credit-account',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::credit-account.credit-account',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDailyQuizDailyQuiz extends Schema.CollectionType {
  collectionName: 'daily_quizs';
  info: {
    singularName: 'daily-quiz';
    pluralName: 'daily-quizs';
    displayName: 'Daily Quiz';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.String & Attribute.Required;
    variable_score: Attribute.BigInteger & Attribute.Required;
    questions: Attribute.Component<'daily-quiz.questions', true>;
    reward: Attribute.Relation<
      'api::daily-quiz.daily-quiz',
      'oneToOne',
      'api::reward.reward'
    >;
    publish_date: Attribute.Date & Attribute.Required;
    group: Attribute.Enumeration<['senior', 'middle', 'junior']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::daily-quiz.daily-quiz',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::daily-quiz.daily-quiz',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDailyQuizAttempDailyQuizAttemp
  extends Schema.CollectionType {
  collectionName: 'daily_quiz_attemps';
  info: {
    singularName: 'daily-quiz-attemp';
    pluralName: 'daily-quiz-attemps';
    displayName: 'Daily Quiz Attemp';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    quiz_id: Attribute.BigInteger;
    user_id: Attribute.BigInteger;
    reattemped: Attribute.Boolean & Attribute.DefaultTo<false>;
    score: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::daily-quiz-attemp.daily-quiz-attemp',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::daily-quiz-attemp.daily-quiz-attemp',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDailyQuizScoreDailyQuizScore extends Schema.CollectionType {
  collectionName: 'daily_quiz_scores';
  info: {
    singularName: 'daily-quiz-score';
    pluralName: 'daily-quiz-scores';
    displayName: 'Daily Quiz Score';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user: Attribute.Relation<
      'api::daily-quiz-score.daily-quiz-score',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    score: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::daily-quiz-score.daily-quiz-score',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::daily-quiz-score.daily-quiz-score',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDailySpinDailySpin extends Schema.SingleType {
  collectionName: 'daily_spins';
  info: {
    singularName: 'daily-spin';
    pluralName: 'daily-spins';
    displayName: 'Daily Spin Config';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    slices: Attribute.Component<'daily-spin.slice', true>;
    title: Attribute.String;
    description: Attribute.String;
    introduction_video: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::daily-spin.daily-spin',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::daily-spin.daily-spin',
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
    slug: Attribute.UID;
    theme_color: Attribute.String;
    background: Attribute.Media;
    from: Attribute.Date;
    to: Attribute.Date;
    discovery_jar_questions: Attribute.Relation<
      'api::disconvery-jar-config.disconvery-jar-config',
      'oneToMany',
      'api::discovery-jar-question.discovery-jar-question'
    >;
    request_rewards: Attribute.Relation<
      'api::disconvery-jar-config.disconvery-jar-config',
      'oneToMany',
      'api::reward.reward'
    >;
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
    mentor: Attribute.String;
    mediaUrl: Attribute.Text;
    time_stamps: Attribute.Component<'time-stamp.time-stamp', true>;
    discovery_jar_config: Attribute.Relation<
      'api::discovery-jar-answer.discovery-jar-answer',
      'manyToOne',
      'api::disconvery-jar-config.disconvery-jar-config'
    >;
    title: Attribute.String;
    discovery_jar_questions: Attribute.Relation<
      'api::discovery-jar-answer.discovery-jar-answer',
      'oneToMany',
      'api::discovery-jar-question.discovery-jar-question'
    >;
    tags: Attribute.String;
    price: Attribute.BigInteger;
    new: Attribute.Boolean;
    trending: Attribute.Boolean;
    grade: Attribute.String;
    desc: Attribute.RichText;
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
    theme: Attribute.Relation<
      'api::discovery-jar-question.discovery-jar-question',
      'manyToOne',
      'api::disconvery-jar-config.disconvery-jar-config'
    >;
    answer: Attribute.Relation<
      'api::discovery-jar-question.discovery-jar-question',
      'manyToOne',
      'api::discovery-jar-answer.discovery-jar-answer'
    >;
    user: Attribute.Relation<
      'api::discovery-jar-question.discovery-jar-question',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    media: Attribute.Media;
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

export interface ApiErrorLogErrorLog extends Schema.CollectionType {
  collectionName: 'error_logs';
  info: {
    singularName: 'error-log';
    pluralName: 'error-logs';
    displayName: 'Error Log';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    label: Attribute.String;
    message: Attribute.Text;
    stack: Attribute.String;
    identifer: Attribute.String;
    additional_info: Attribute.JSON;
    error_type: Attribute.Relation<
      'api::error-log.error-log',
      'oneToOne',
      'api::error-type.error-type'
    >;
    request_url: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::error-log.error-log',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::error-log.error-log',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiErrorTypeErrorType extends Schema.CollectionType {
  collectionName: 'error_types';
  info: {
    singularName: 'error-type';
    pluralName: 'error-types';
    displayName: 'Error Type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    code_name: Attribute.String;
    description: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::error-type.error-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::error-type.error-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHardProductHardProduct extends Schema.CollectionType {
  collectionName: 'hard_products';
  info: {
    singularName: 'hard-product';
    pluralName: 'hard-products';
    displayName: 'Hard Product';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    desc: Attribute.RichText;
    price: Attribute.Decimal;
    images: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::hard-product.hard-product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::hard-product.hard-product',
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

export interface ApiLikeLike extends Schema.CollectionType {
  collectionName: 'likes';
  info: {
    singularName: 'like';
    pluralName: 'likes';
    displayName: 'Like';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    userId: Attribute.BigInteger;
    contentId: Attribute.BigInteger;
    type: Attribute.Enumeration<['comic', 'video', 'live', 'learn', 'titbit']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::like.like', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::like.like', 'oneToOne', 'admin::user'> &
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
    from: Attribute.DateTime;
    to: Attribute.DateTime;
    new: Attribute.Boolean & Attribute.DefaultTo<false>;
    trending: Attribute.Boolean & Attribute.DefaultTo<false>;
    speaker: Attribute.Relation<
      'api::live.live',
      'oneToOne',
      'api::live-speaker.live-speaker'
    >;
    timestamp_reward: Attribute.Component<'timestamp-reward.timestamp-reward'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::live.live', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::live.live', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiLiveSpeakerLiveSpeaker extends Schema.CollectionType {
  collectionName: 'live_speakers';
  info: {
    singularName: 'live-speaker';
    pluralName: 'live-speakers';
    displayName: 'Live Speaker';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    introduction: Attribute.Text;
    role: Attribute.String;
    profile: Attribute.Media;
    live: Attribute.Relation<
      'api::live-speaker.live-speaker',
      'oneToOne',
      'api::live.live'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::live-speaker.live-speaker',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::live-speaker.live-speaker',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMailTemplateMailTemplate extends Schema.CollectionType {
  collectionName: 'mail_templates';
  info: {
    singularName: 'mail-template';
    pluralName: 'mail-templates';
    displayName: 'Mail template';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    subject: Attribute.String;
    body: Attribute.Text;
    variables: Attribute.JSON;
    template: Attribute.JSON;
    label: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::mail-template.mail-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::mail-template.mail-template',
      'oneToOne',
      'admin::user'
    > &
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
    new: Attribute.Boolean & Attribute.DefaultTo<false>;
    trending: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::nac.nac', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::nac.nac', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiNacRegistrationNacRegistration
  extends Schema.CollectionType {
  collectionName: 'nac_registrations';
  info: {
    singularName: 'nac-registration';
    pluralName: 'nac-registrations';
    displayName: 'nac-registration';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    student_name: Attribute.String;
    email: Attribute.String & Attribute.Unique;
    phone: Attribute.String;
    dob: Attribute.String;
    school_name: Attribute.String;
    grade: Attribute.String;
    section: Attribute.String;
    city: Attribute.String;
    device: Attribute.String;
    payment_info: Attribute.JSON;
    user_info: Attribute.JSON;
    notified: Attribute.Boolean;
    wnotified: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::nac-registration.nac-registration',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::nac-registration.nac-registration',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNacResultNacResult extends Schema.CollectionType {
  collectionName: 'nac_results';
  info: {
    singularName: 'nac-result';
    pluralName: 'nac-results';
    displayName: 'nac-result';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    registration_code: Attribute.String;
    school_name: Attribute.String;
    grade: Attribute.String;
    correct_answer: Attribute.String;
    incorrect_answers: Attribute.String;
    skipped_answers: Attribute.String;
    score: Attribute.String;
    percentile: Attribute.String;
    rank: Attribute.String;
    email: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::nac-result.nac-result',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::nac-result.nac-result',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNewsletterSubscriberNewsletterSubscriber
  extends Schema.CollectionType {
  collectionName: 'newsletter_subscribers';
  info: {
    singularName: 'newsletter-subscriber';
    pluralName: 'newsletter-subscribers';
    displayName: 'Newsletter Subscriber';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    fullName: Attribute.String;
    email: Attribute.Email & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::newsletter-subscriber.newsletter-subscriber',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::newsletter-subscriber.newsletter-subscriber',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNotificationNotification extends Schema.CollectionType {
  collectionName: 'notifications';
  info: {
    singularName: 'notification';
    pluralName: 'notifications';
    displayName: 'notification';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    title: Attribute.String;
    message: Attribute.Text;
    status: Attribute.Enumeration<['read', 'unread']>;
    type: Attribute.Enumeration<['system', 'email']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNotificationxNotificationx extends Schema.CollectionType {
  collectionName: 'notificationxes';
  info: {
    singularName: 'notificationx';
    pluralName: 'notificationxes';
    displayName: 'notificationx';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    mail_template: Attribute.Relation<
      'api::notificationx.notificationx',
      'oneToOne',
      'api::mail-template.mail-template'
    >;
    channel: Attribute.Enumeration<['system', 'mail']>;
    subject: Attribute.String;
    body: Attribute.String;
    variables: Attribute.JSON;
    user: Attribute.Relation<
      'api::notificationx.notificationx',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    status: Attribute.Enumeration<
      ['pending', 'sent', 'bounce', 'read', 'unread']
    > &
      Attribute.DefaultTo<'pending'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notificationx.notificationx',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::notificationx.notificationx',
      'oneToOne',
      'admin::user'
    > &
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
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::plan.plan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::plan.plan', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiPodcastPodcast extends Schema.CollectionType {
  collectionName: 'podcasts';
  info: {
    singularName: 'podcast';
    pluralName: 'podcasts';
    displayName: 'Podcast';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    desc: Attribute.String;
    author: Attribute.String;
    type: Attribute.Enumeration<['audio', 'video']>;
    media_url: Attribute.String;
    premium: Attribute.Boolean & Attribute.DefaultTo<false>;
    tags: Attribute.String;
    recommend: Attribute.Boolean & Attribute.DefaultTo<false>;
    thumbnail: Attribute.Media;
    category: Attribute.Relation<
      'api::podcast.podcast',
      'manyToOne',
      'api::podcast-category.podcast-category'
    >;
    attached_clips: Attribute.Relation<
      'api::podcast.podcast',
      'oneToOne',
      'api::podcast-upload.podcast-upload'
    >;
    price: Attribute.BigInteger;
    trending: Attribute.Boolean & Attribute.DefaultTo<false>;
    new: Attribute.Boolean & Attribute.DefaultTo<false>;
    grade: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::podcast.podcast',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::podcast.podcast',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPodcastCategoryPodcastCategory
  extends Schema.CollectionType {
  collectionName: 'podcast_categories';
  info: {
    singularName: 'podcast-category';
    pluralName: 'podcast-categories';
    displayName: 'Podcast Category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    thumbnail: Attribute.Media;
    podcasts: Attribute.Relation<
      'api::podcast-category.podcast-category',
      'oneToMany',
      'api::podcast.podcast'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::podcast-category.podcast-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::podcast-category.podcast-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPodcastUploadPodcastUpload extends Schema.CollectionType {
  collectionName: 'podcast_uploads';
  info: {
    singularName: 'podcast-upload';
    pluralName: 'podcast-uploads';
    displayName: 'Podcast Upload';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    label: Attribute.String;
    file: Attribute.Media;
    user: Attribute.Relation<
      'api::podcast-upload.podcast-upload',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    podcast: Attribute.Relation<
      'api::podcast-upload.podcast-upload',
      'oneToOne',
      'api::podcast.podcast'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::podcast-upload.podcast-upload',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::podcast-upload.podcast-upload',
      'oneToOne',
      'admin::user'
    > &
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
    coins: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    type: Attribute.Enumeration<['avatar', 'banner']> &
      Attribute.Required &
      Attribute.DefaultTo<'avatar'>;
    premium: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    avatar: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::avatar.avatar'
    >;
    bannar: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::bannar.bannar'
    >;
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
      [
        'course',
        'video',
        'comic',
        'live',
        'jar',
        'challange',
        'nac',
        'podcast',
        'titbits'
      ]
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
    label: Attribute.String;
    reward: Attribute.Relation<
      'api::quiz.quiz',
      'manyToOne',
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

export interface ApiReferralReferral extends Schema.CollectionType {
  collectionName: 'referrals';
  info: {
    singularName: 'referral';
    pluralName: 'referrals';
    displayName: 'Referral';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    referring_user_id: Attribute.String;
    referred_user_id: Attribute.String;
    joining_reward: Attribute.Boolean & Attribute.DefaultTo<false>;
    user_tier: Attribute.Enumeration<['free', 'premium']> &
      Attribute.DefaultTo<'free'>;
    premium_tier_reward: Attribute.Boolean & Attribute.DefaultTo<false>;
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

export interface ApiReferralRewardReferralReward extends Schema.CollectionType {
  collectionName: 'referral_rewards';
  info: {
    singularName: 'referral-reward';
    pluralName: 'referral-rewards';
    displayName: 'referral reward';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    credits: Attribute.BigInteger;
    type: Attribute.Enumeration<['free', 'basic', 'premium', 'twentyreferral']>;
    refId: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::referral-reward.referral-reward',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::referral-reward.referral-reward',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiReminderReminder extends Schema.CollectionType {
  collectionName: 'reminders';
  info: {
    singularName: 'reminder';
    pluralName: 'reminders';
    displayName: 'reminder';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    message: Attribute.Text;
    schedule: Attribute.DateTime;
    user: Attribute.Relation<
      'api::reminder.reminder',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    notified: Attribute.Boolean & Attribute.DefaultTo<false>;
    type: Attribute.Enumeration<['live', 'credit', 'plan', 'event']>;
    contentId: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::reminder.reminder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::reminder.reminder',
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
    type: Attribute.Enumeration<
      ['coins', 'badge', 'avatar', 'certificate', 'bannar']
    >;
    value: Attribute.String;
    content_id: Attribute.String;
    challenge: Attribute.Relation<
      'api::reward.reward',
      'manyToMany',
      'api::challenge.challenge'
    >;
    quiz: Attribute.Relation<
      'api::reward.reward',
      'oneToMany',
      'api::quiz.quiz'
    >;
    badge: Attribute.Relation<
      'api::reward.reward',
      'oneToOne',
      'api::badge.badge'
    >;
    certificate: Attribute.Relation<
      'api::reward.reward',
      'oneToOne',
      'api::certificate.certificate'
    >;
    course: Attribute.Relation<
      'api::reward.reward',
      'manyToMany',
      'api::course.course'
    >;
    avatar: Attribute.Relation<
      'api::reward.reward',
      'oneToOne',
      'api::avatar.avatar'
    >;
    bannar: Attribute.Relation<
      'api::reward.reward',
      'oneToOne',
      'api::bannar.bannar'
    >;
    challange_winner_reward: Attribute.Relation<
      'api::reward.reward',
      'manyToOne',
      'api::challenge.challenge'
    >;
    discovery_jar_config: Attribute.Relation<
      'api::reward.reward',
      'manyToOne',
      'api::disconvery-jar-config.disconvery-jar-config'
    >;
    time_tracking_reward: Attribute.Relation<
      'api::reward.reward',
      'oneToOne',
      'api::time-tracking-reward.time-tracking-reward'
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

export interface ApiSchoolRegistrationSchoolRegistration
  extends Schema.CollectionType {
  collectionName: 'school_registrations';
  info: {
    singularName: 'school-registration';
    pluralName: 'school-registrations';
    displayName: 'school-registration';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    school_name: Attribute.String;
    email: Attribute.String & Attribute.Unique;
    contact_no: Attribute.String;
    school_address: Attribute.String;
    principle_name: Attribute.String;
    payment_info: Attribute.JSON;
    school_branch: Attribute.String;
    password: Attribute.String;
    link: Attribute.String;
    notified: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::school-registration.school-registration',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::school-registration.school-registration',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShopifyCouponShopifyCoupon extends Schema.CollectionType {
  collectionName: 'shopify_coupons';
  info: {
    singularName: 'shopify-coupon';
    pluralName: 'shopify-coupons';
    displayName: 'Shopify Coupon';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    code: Attribute.String;
    user: Attribute.Relation<
      'api::shopify-coupon.shopify-coupon',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    start: Attribute.Date;
    end: Attribute.Date;
    oneTime: Attribute.Boolean;
    configuration: Attribute.JSON;
    title: Attribute.String;
    expires: Attribute.Boolean & Attribute.DefaultTo<false>;
    discount: Attribute.String;
    discountType: Attribute.Enumeration<['fixed_amount', 'percentage']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shopify-coupon.shopify-coupon',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shopify-coupon.shopify-coupon',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiShopifyPriceRuleShopifyPriceRule
  extends Schema.CollectionType {
  collectionName: 'shopify_price_rules';
  info: {
    singularName: 'shopify-price-rule';
    pluralName: 'shopify-price-rules';
    displayName: 'Shopify Price Rule';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    priceRuleId: Attribute.String;
    title: Attribute.String;
    discount: Attribute.String;
    deductCoins: Attribute.String;
    discountType: Attribute.Enumeration<['fixed_amount', 'percentage']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shopify-price-rule.shopify-price-rule',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shopify-price-rule.shopify-price-rule',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSpinSpin extends Schema.CollectionType {
  collectionName: 'spins';
  info: {
    singularName: 'spin';
    pluralName: 'spins';
    displayName: 'Spin';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user_id: Attribute.BigInteger;
    reward_id: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::spin.spin', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::spin.spin', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiStackStack extends Schema.CollectionType {
  collectionName: 'stacks';
  info: {
    singularName: 'stack';
    pluralName: 'stacks';
    displayName: 'Stack';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    stackDate: Attribute.Date;
    data: Attribute.JSON;
    identifier: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::stack.stack',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::stack.stack',
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

export interface ApiTimeTrackingRewardTimeTrackingReward
  extends Schema.CollectionType {
  collectionName: 'time_tracking_rewards';
  info: {
    singularName: 'time-tracking-reward';
    pluralName: 'time-tracking-rewards';
    displayName: 'Time Tracking';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contentType: Attribute.Enumeration<['video', 'comic', 'live']>;
    contentId: Attribute.BigInteger;
    reward: Attribute.Relation<
      'api::time-tracking-reward.time-tracking-reward',
      'oneToOne',
      'api::reward.reward'
    >;
    duration: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::time-tracking-reward.time-tracking-reward',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::time-tracking-reward.time-tracking-reward',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTipVideoTipVideo extends Schema.CollectionType {
  collectionName: 'tip_videos';
  info: {
    singularName: 'tip-video';
    pluralName: 'tip-videos';
    displayName: 'Tip Video';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    slug: Attribute.UID<'api::tip-video.tip-video', 'title'>;
    thumbnail: Attribute.Media;
    route: Attribute.String;
    vimeoUrl: Attribute.String;
    category: Attribute.Relation<
      'api::tip-video.tip-video',
      'manyToOne',
      'api::tip-video-category.tip-video-category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tip-video.tip-video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tip-video.tip-video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTipVideoCategoryTipVideoCategory
  extends Schema.CollectionType {
  collectionName: 'tip_video_categories';
  info: {
    singularName: 'tip-video-category';
    pluralName: 'tip-video-categories';
    displayName: 'Tip Video Category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    tip_videos: Attribute.Relation<
      'api::tip-video-category.tip-video-category',
      'oneToMany',
      'api::tip-video.tip-video'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tip-video-category.tip-video-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tip-video-category.tip-video-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTitbitTitbit extends Schema.CollectionType {
  collectionName: 'titbits';
  info: {
    singularName: 'titbit';
    pluralName: 'titbits';
    displayName: 'Titbit';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    caption: Attribute.Text;
    media: Attribute.Media;
    tags: Attribute.String;
    source: Attribute.String;
    titbits_category: Attribute.Relation<
      'api::titbit.titbit',
      'manyToOne',
      'api::titbits-category.titbits-category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::titbit.titbit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::titbit.titbit',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTitbitsCategoryTitbitsCategory
  extends Schema.CollectionType {
  collectionName: 'titbits_categories';
  info: {
    singularName: 'titbits-category';
    pluralName: 'titbits-categories';
    displayName: 'Titbits Category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    titbits: Attribute.Relation<
      'api::titbits-category.titbits-category',
      'oneToMany',
      'api::titbit.titbit'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::titbits-category.titbits-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::titbits-category.titbits-category',
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

export interface ApiTransactionTransaction extends Schema.CollectionType {
  collectionName: 'transactions';
  info: {
    singularName: 'transaction';
    pluralName: 'transactions';
    displayName: 'Transaction';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    label: Attribute.String;
    type: Attribute.Enumeration<['subsription', 'credits']>;
    amount: Attribute.BigInteger;
    currency: Attribute.String;
    user_id: Attribute.BigInteger;
    plan_id: Attribute.BigInteger;
    topup_id: Attribute.BigInteger;
    razorpay_order_id: Attribute.String;
    razorpay_payment_id: Attribute.String;
    status: Attribute.Enumeration<['created', 'captured', 'refunded']>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::transaction.transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::transaction.transaction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiV1V1 extends Schema.CollectionType {
  collectionName: 'v1s';
  info: {
    singularName: 'v1';
    pluralName: 'v1s';
    displayName: 'v1';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    version: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::v1.v1', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::v1.v1', 'oneToOne', 'admin::user'> &
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
    thumbnail: Attribute.Media & Attribute.Required;
    quiz: Attribute.Relation<'api::video.video', 'oneToOne', 'api::quiz.quiz'>;
    new: Attribute.Boolean & Attribute.DefaultTo<false>;
    trending: Attribute.Boolean & Attribute.DefaultTo<false>;
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
      'api::activity-request.activity-request': ApiActivityRequestActivityRequest;
      'api::avatar.avatar': ApiAvatarAvatar;
      'api::badge.badge': ApiBadgeBadge;
      'api::bannar.bannar': ApiBannarBannar;
      'api::banner.banner': ApiBannerBanner;
      'api::carousel.carousel': ApiCarouselCarousel;
      'api::certificate.certificate': ApiCertificateCertificate;
      'api::certification.certification': ApiCertificationCertification;
      'api::certification-event.certification-event': ApiCertificationEventCertificationEvent;
      'api::certification-event-module.certification-event-module': ApiCertificationEventModuleCertificationEventModule;
      'api::challenge.challenge': ApiChallengeChallenge;
      'api::challenge-request.challenge-request': ApiChallengeRequestChallengeRequest;
      'api::comic.comic': ApiComicComic;
      'api::comic-book.comic-book': ApiComicBookComicBook;
      'api::control.control': ApiControlControl;
      'api::course.course': ApiCourseCourse;
      'api::credit-account.credit-account': ApiCreditAccountCreditAccount;
      'api::daily-quiz.daily-quiz': ApiDailyQuizDailyQuiz;
      'api::daily-quiz-attemp.daily-quiz-attemp': ApiDailyQuizAttempDailyQuizAttemp;
      'api::daily-quiz-score.daily-quiz-score': ApiDailyQuizScoreDailyQuizScore;
      'api::daily-spin.daily-spin': ApiDailySpinDailySpin;
      'api::disconvery-jar-config.disconvery-jar-config': ApiDisconveryJarConfigDisconveryJarConfig;
      'api::discovery-jar-answer.discovery-jar-answer': ApiDiscoveryJarAnswerDiscoveryJarAnswer;
      'api::discovery-jar-question.discovery-jar-question': ApiDiscoveryJarQuestionDiscoveryJarQuestion;
      'api::error-log.error-log': ApiErrorLogErrorLog;
      'api::error-type.error-type': ApiErrorTypeErrorType;
      'api::hard-product.hard-product': ApiHardProductHardProduct;
      'api::how-it-work.how-it-work': ApiHowItWorkHowItWork;
      'api::like.like': ApiLikeLike;
      'api::live.live': ApiLiveLive;
      'api::live-speaker.live-speaker': ApiLiveSpeakerLiveSpeaker;
      'api::mail-template.mail-template': ApiMailTemplateMailTemplate;
      'api::nac.nac': ApiNacNac;
      'api::nac-registration.nac-registration': ApiNacRegistrationNacRegistration;
      'api::nac-result.nac-result': ApiNacResultNacResult;
      'api::newsletter-subscriber.newsletter-subscriber': ApiNewsletterSubscriberNewsletterSubscriber;
      'api::notification.notification': ApiNotificationNotification;
      'api::notificationx.notificationx': ApiNotificationxNotificationx;
      'api::plan.plan': ApiPlanPlan;
      'api::podcast.podcast': ApiPodcastPodcast;
      'api::podcast-category.podcast-category': ApiPodcastCategoryPodcastCategory;
      'api::podcast-upload.podcast-upload': ApiPodcastUploadPodcastUpload;
      'api::product.product': ApiProductProduct;
      'api::promocode.promocode': ApiPromocodePromocode;
      'api::promocode-usage.promocode-usage': ApiPromocodeUsagePromocodeUsage;
      'api::purchase.purchase': ApiPurchasePurchase;
      'api::quiz.quiz': ApiQuizQuiz;
      'api::quiz-config.quiz-config': ApiQuizConfigQuizConfig;
      'api::real-purchase.real-purchase': ApiRealPurchaseRealPurchase;
      'api::referral.referral': ApiReferralReferral;
      'api::referral-reward.referral-reward': ApiReferralRewardReferralReward;
      'api::reminder.reminder': ApiReminderReminder;
      'api::reward.reward': ApiRewardReward;
      'api::school-registration.school-registration': ApiSchoolRegistrationSchoolRegistration;
      'api::shopify-coupon.shopify-coupon': ApiShopifyCouponShopifyCoupon;
      'api::shopify-price-rule.shopify-price-rule': ApiShopifyPriceRuleShopifyPriceRule;
      'api::spin.spin': ApiSpinSpin;
      'api::stack.stack': ApiStackStack;
      'api::subscription.subscription': ApiSubscriptionSubscription;
      'api::time-tracking-reward.time-tracking-reward': ApiTimeTrackingRewardTimeTrackingReward;
      'api::tip-video.tip-video': ApiTipVideoTipVideo;
      'api::tip-video-category.tip-video-category': ApiTipVideoCategoryTipVideoCategory;
      'api::titbit.titbit': ApiTitbitTitbit;
      'api::titbits-category.titbits-category': ApiTitbitsCategoryTitbitsCategory;
      'api::top-up.top-up': ApiTopUpTopUp;
      'api::transaction.transaction': ApiTransactionTransaction;
      'api::v1.v1': ApiV1V1;
      'api::video.video': ApiVideoVideo;
      'api::watched.watched': ApiWatchedWatched;
    }
  }
}
