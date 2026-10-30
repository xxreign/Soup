import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GAMES, getGameById } from "@/data/games";
import { GameClientView } from "./GameClientView";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return GAMES.map((game) => ({
    slug: game.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameById(slug);

  if (!game) {
    return {
      title: "Game Not Found | Retro Arcade",
    };
  }

  return {
    title: `${game.title} - Retro Arcade Cabinet`,
    description: game.description,
  };
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameById(slug);

  if (!game) {
    notFound();
  }

  return <GameClientView game={game} />;
}
