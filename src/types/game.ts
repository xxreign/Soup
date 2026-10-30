export interface ArcadeGame {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  developer: string;
  genre: string;
  themeColor: {
    primary: string;
    border: string;
    shadow: string;
    text: string;
    bgAccent: string;
  };
  payout: string;
  comingSoon: boolean;
  cabinetArt: string;
}
