import Header from '@/components/moxbnb/Header';
import Footer from '@/components/moxbnb/Footer';
import PublicInfoPage from '@/components/moxbnb/PublicInfoPage';

export default function HelpCenterPage() {
  return <><Header /><PublicInfoPage translationPrefix="helpCenter" sectionCount={4} /><Footer /></>;
}