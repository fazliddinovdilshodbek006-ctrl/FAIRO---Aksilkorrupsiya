import { LawArticle } from "@/types";

export const LAWS: LawArticle[] = [
  {
    id: "constitution_art_8",
    title: "Constitution — Article on equality before the law",
    source: "constitution",
    article: "Constitution of Uzbekistan",
    plain: {
      kid: "Rules are the same for everyone. Nobody can buy a special rule just for them.",
      explorer: "Every person is equal before the law. No one can pay to get a different rule.",
      teen: "All citizens are equal under the Constitution — wealth or status cannot change how the law applies.",
      civic: "The Constitution of the Republic of Uzbekistan guarantees equality before the law and prohibits any privilege based on payment, status or position.",
    },
  },
  {
    id: "anticorr_art_3",
    title: "Anti-Corruption Law — Definition of corruption",
    source: "anti_corruption_law",
    article: "Law on Combating Corruption, Art. 3",
    plain: {
      kid: "If someone gives a gift to skip the rules — that is corruption. It hurts everyone.",
      explorer: "Corruption is using power dishonestly for personal gain. It is against the law.",
      teen: "Corruption means abusing entrusted power for private benefit — including bribery, favoritism, and embezzlement.",
      civic: "Per Art. 3 of the Law on Combating Corruption, corruption is the unlawful use of one's official position for personal gain or in the interest of others.",
    },
  },
  {
    id: "anticorr_art_4",
    title: "Anti-Corruption Law — Bribery prohibition",
    source: "anti_corruption_law",
    article: "Law on Combating Corruption, Art. 4",
    plain: {
      kid: "Giving or taking money to break a rule is not allowed.",
      explorer: "Offering or accepting a bribe is forbidden by law.",
      teen: "Both giving and accepting a bribe are crimes — even just offering one is punishable.",
      civic: "Both active and passive bribery are prohibited under Uzbek law and carry significant criminal penalties.",
    },
  },
  {
    id: "anticorr_education",
    title: "Anti-Corruption Law — Education and prevention",
    source: "anti_corruption_law",
    article: "Law on Combating Corruption — Prevention",
    plain: {
      kid: "Learning honesty is part of growing up. That's what we do here!",
      explorer: "The law says young people should learn how to recognize and refuse corruption.",
      teen: "Anti-corruption education is mandated to build a culture of integrity in society.",
      civic: "Uzbek law mandates anti-corruption education and awareness as core preventive measures, especially for youth.",
    },
  },
  {
    id: "constitution_public_service",
    title: "Constitution — Public service must serve the people",
    source: "constitution",
    article: "Constitution of Uzbekistan — Public service",
    plain: {
      kid: "Doctors, teachers, police — they help everyone, not just people with money.",
      explorer: "Public officials must serve all citizens fairly, not their own pocket.",
      teen: "Public office is a public trust — officials must act in the interest of the people.",
      civic: "Public officials must exercise their authority impartially and in the public interest, with accountability mechanisms enshrined in the Constitution.",
    },
  },
];

export function lawById(id: string) {
  return LAWS.find((l) => l.id === id) ?? LAWS[1];
}
