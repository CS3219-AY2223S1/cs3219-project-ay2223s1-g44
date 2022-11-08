import { MdCode, MdSave, MdLibraryBooks } from 'react-icons/md';
import { FeatureItemProps } from '../../components/FeatureItem';

export const FEATURE_ITEMS: FeatureItemProps[] = [
  {
    icon: MdCode,
    heading: 'Collaborative Coding',
    description: 'Real-time collaborative code editor for maximised cooperation',
  },
  {
    icon: MdSave,
    heading: 'Save Progress',
    description: 'Automatic save to maintain question progress',
  },
  {
    icon: MdLibraryBooks,
    heading: 'Plethora of Questions',
    description: 'An endless supply of algorithm questions to grind',
  },
];
