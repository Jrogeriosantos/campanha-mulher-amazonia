import CampaignApp from "./components/CampaignApp";

export const metadata = {
  title: "Campanha Mulher Amazônia",
  description: "Participe da nossa campanha especial em homenagem ao Dia Internacional da Mulher",
  openGraph: {
    title: "Campanha Mulher Amazônia",
    description: "Participe da nossa campanha especial em homenagem ao Dia Internacional da Mulher",
  },
};

export default function Home() {
  return <CampaignApp />;
}
