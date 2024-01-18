import type { Schema, Attribute } from '@strapi/strapi';

export interface ActivityModuleActiviyModule extends Schema.Component {
  collectionName: 'components_activity_module_activiy_modules';
  info: {
    displayName: 'Activiy Module';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    name: Attribute.Text;
    explorationTime: Attribute.BigInteger;
    minExplorationTime: Attribute.BigInteger;
    prepration_materials: Attribute.Component<
      'prepration-materials.prepration-materials',
      true
    >;
    desc: Attribute.RichText;
    mediaUrl: Attribute.Text;
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
    name: Attribute.String;
    explorationTime: Attribute.BigInteger;
    minExplorationTime: Attribute.BigInteger;
    desc: Attribute.RichText;
    mediaUrl: Attribute.Text;
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
    title: Attribute.Text;
    qty: Attribute.String;
    product_link: Attribute.Text;
    print: Attribute.Text;
    desc: Attribute.RichText;
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
    question: Attribute.Text;
    image: Attribute.Media;
    audio: Attribute.Media;
    type: Attribute.Enumeration<
      ['select', 'boolean', 'order', 'multiselect', 'textinput']
    >;
    duration: Attribute.Integer;
    options: Attribute.Component<'qtions.qtions', true>;
    answer: Attribute.String;
    placeholder: Attribute.String;
  };
}

export interface QtionsQtions extends Schema.Component {
  collectionName: 'components_qtions_qtions';
  info: {
    displayName: 'Qtions';
  };
  attributes: {
    name: Attribute.String;
    value: Attribute.String;
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

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'activity-module.activiy-module': ActivityModuleActiviyModule;
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
    }
  }
}
