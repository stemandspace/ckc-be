import type { Schema, Attribute } from '@strapi/strapi';

export interface ActivityModuleActiviyModule extends Schema.Component {
  collectionName: 'components_activity_module_activiy_modules';
  info: {
    displayName: 'Activiy Module';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    name: Attribute.Text & Attribute.Required;
    explorationTime: Attribute.BigInteger;
    prepration_materials: Attribute.Component<
      'prepration-materials.prepration-materials',
      true
    >;
    desc: Attribute.RichText;
    mediaUrl: Attribute.Text & Attribute.Required;
    rewards: Attribute.Relation<
      'activity-module.activiy-module',
      'oneToMany',
      'api::reward.reward'
    >;
    index: Attribute.BigInteger;
    kit: Attribute.String;
  };
}

export interface CertificationCertificationConfig extends Schema.Component {
  collectionName: 'components_certification_certification_configs';
  info: {
    displayName: 'certification-config';
  };
  attributes: {
    title: Attribute.String;
    pdf: Attribute.Media;
    config: Attribute.JSON;
  };
}

export interface CertificationCertificationEvents extends Schema.Component {
  collectionName: 'components_certification_certification_events';
  info: {
    displayName: 'Certification Events';
  };
  attributes: {
    title: Attribute.String;
    desc: Attribute.Text;
    thumbnail: Attribute.Media;
    link: Attribute.String;
  };
}

export interface DailyQuizQuestions extends Schema.Component {
  collectionName: 'components_daily_quiz_questions';
  info: {
    displayName: 'Questions';
    icon: 'bulletList';
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 20;
        maxLength: 100;
      }>;
    option1: Attribute.String & Attribute.Required;
    option2: Attribute.String & Attribute.Required;
    option3: Attribute.String;
    option4: Attribute.String;
    answer: Attribute.String & Attribute.Required;
  };
}

export interface DailySpinSlice extends Schema.Component {
  collectionName: 'components_daily_spin_slices';
  info: {
    displayName: 'slice';
    icon: 'command';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    type: Attribute.Enumeration<
      ['coin', 'credit', 'empty', 'systempromocode', 'marketplacepromocode']
    >;
    value: Attribute.BigInteger;
  };
}

export interface MilestoneMilestones extends Schema.Component {
  collectionName: 'components_milestone_milestones';
  info: {
    displayName: 'milestones';
    description: '';
  };
  attributes: {
    rewards: Attribute.Relation<
      'milestone.milestones',
      'oneToMany',
      'api::reward.reward'
    >;
    milestone: Attribute.Integer;
  };
}

export interface ModuleSlideModuleSlide extends Schema.Component {
  collectionName: 'components_module_slide_module_slides';
  info: {
    displayName: 'Module Slide';
    icon: 'stack';
  };
  attributes: {
    name: Attribute.Text;
    mediaUrl: Attribute.Text;
    type: Attribute.Enumeration<['ppt', 'image', 'video']>;
  };
}

export interface ModuleModule extends Schema.Component {
  collectionName: 'components_module_modules';
  info: {
    displayName: 'Module';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    explorationTime: Attribute.BigInteger;
    desc: Attribute.RichText;
    mediaUrl: Attribute.Text & Attribute.Required;
    quiz: Attribute.Relation<'module.module', 'oneToOne', 'api::quiz.quiz'>;
  };
}

export interface PreprationMaterialsPreprationMaterials
  extends Schema.Component {
  collectionName: 'components_prepration_materials_prepration_materials';
  info: {
    displayName: 'Prepration Materials';
    icon: 'archive';
    description: '';
  };
  attributes: {
    title: Attribute.Text & Attribute.Required;
    qty: Attribute.String & Attribute.Required;
    product_id: Attribute.Text;
    desc: Attribute.RichText;
    attachment: Attribute.Media;
  };
}

export interface QlideQlide extends Schema.Component {
  collectionName: 'components_qlide_qlides';
  info: {
    displayName: 'Qlide';
    icon: 'expand';
    description: '';
  };
  attributes: {
    question: Attribute.Text & Attribute.Required;
    image: Attribute.Media;
    audio: Attribute.Media;
    type: Attribute.Enumeration<
      ['select', 'boolean', 'order', 'multiselect', 'textinput']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'select'>;
    duration: Attribute.Integer;
    options: Attribute.Component<'qtions.qtions', true>;
    answer: Attribute.String & Attribute.Required;
    placeholder: Attribute.String;
  };
}

export interface QtionsQtions extends Schema.Component {
  collectionName: 'components_qtions_qtions';
  info: {
    displayName: 'Qtions';
    description: '';
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
  };
}

export interface QuestionQuestion extends Schema.Component {
  collectionName: 'components_question_questions';
  info: {
    displayName: 'question';
    description: '';
  };
  attributes: {
    imageUrl: Attribute.Text;
    text: Attribute.Text;
  };
}

export interface QuizSlideActionQuizSlideAction extends Schema.Component {
  collectionName: 'components_quiz_slide_action_quiz_slide_actions';
  info: {
    displayName: 'quiz_slide_action';
    icon: 'connector';
  };
  attributes: {};
}

export interface QuizSlideQuestionQuizSlideQuestion extends Schema.Component {
  collectionName: 'components_quiz_slide_question_quiz_slide_questions';
  info: {
    displayName: 'Quiz Slide Question';
    icon: 'connector';
    description: '';
  };
  attributes: {
    type: Attribute.Enumeration<
      ['textinput', 'select', 'boolean', 'order', 'multiselect']
    >;
    options: Attribute.JSON;
  };
}

export interface QuizSlidesQuizSlides extends Schema.Component {
  collectionName: 'components_quiz_slides_quiz_slides';
  info: {
    displayName: 'Quiz Slides';
    icon: 'cube';
    description: '';
  };
  attributes: {
    action: Attribute.Component<'quiz-slide-question.quiz-slide-question'>;
    duration: Attribute.BigInteger;
    question: Attribute.Component<'question.question'>;
    answer: Attribute.JSON;
  };
}

export interface SlidesSlides extends Schema.Component {
  collectionName: 'components_slides_slides';
  info: {
    displayName: 'slides';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    desc: Attribute.Text;
    thumbnail: Attribute.Media;
  };
}

export interface TimeStampTimeStamp extends Schema.Component {
  collectionName: 'components_time_stamp_time_stamps';
  info: {
    displayName: 'Time Stamp';
  };
  attributes: {
    title: Attribute.String;
    start_timestamp: Attribute.BigInteger;
    end_stamp: Attribute.BigInteger;
  };
}

export interface TimestampRewardTimestampReward extends Schema.Component {
  collectionName: 'components_timestamp_reward_timestamp_rewards';
  info: {
    displayName: 'timestamp-reward';
    description: '';
  };
  attributes: {
    seconds: Attribute.BigInteger;
    reward: Attribute.Relation<
      'timestamp-reward.timestamp-reward',
      'oneToOne',
      'api::reward.reward'
    >;
    active: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'activity-module.activiy-module': ActivityModuleActiviyModule;
      'certification.certification-config': CertificationCertificationConfig;
      'certification.certification-events': CertificationCertificationEvents;
      'daily-quiz.questions': DailyQuizQuestions;
      'daily-spin.slice': DailySpinSlice;
      'milestone.milestones': MilestoneMilestones;
      'module-slide.module-slide': ModuleSlideModuleSlide;
      'module.module': ModuleModule;
      'prepration-materials.prepration-materials': PreprationMaterialsPreprationMaterials;
      'qlide.qlide': QlideQlide;
      'qtions.qtions': QtionsQtions;
      'question.question': QuestionQuestion;
      'quiz-slide-action.quiz-slide-action': QuizSlideActionQuizSlideAction;
      'quiz-slide-question.quiz-slide-question': QuizSlideQuestionQuizSlideQuestion;
      'quiz-slides.quiz-slides': QuizSlidesQuizSlides;
      'slides.slides': SlidesSlides;
      'time-stamp.time-stamp': TimeStampTimeStamp;
      'timestamp-reward.timestamp-reward': TimestampRewardTimestampReward;
    }
  }
}
