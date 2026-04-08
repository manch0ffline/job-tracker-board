export type Card = {
  id: string;
  title: string;
  company: string;
  link: string;
  contact: string;
  notes: string;
};

export type JobCard = Card;

export type Column = {
  id: string;
  title: string;
  color: string;
  cards: Card[];
};
