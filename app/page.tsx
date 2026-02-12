import CampaignApp from "./components/CampaignApp";
import TextReplacer from "./components/TextReplacer";

export const metadata = {
  title: "Campanha Mulher Amazônia",
  description: "Participe da nossa campanha especial em homenagem ao Dia Internacional da Mulher",
  openGraph: {
    title: "Campanha Mulher Amazônia",
    description: "Participe da nossa campanha especial em homenagem ao Dia Internacional da Mulher",
  },
};

export default function Home() {
  return (
    <>
      <TextReplacer />
      <CampaignApp />
    </>
  );
}
