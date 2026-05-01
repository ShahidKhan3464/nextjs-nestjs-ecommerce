"use client";

import * as React from "react";
import en from "@/i18n/messages/en.json";

type Messages = typeof en;

const MessagesContext = React.createContext<Messages>(en);
const MessagesProvider = MessagesContext.Provider;

export function LocaleProvider({
  children,
  messages = en,
}: {
  children: React.ReactNode;
  messages?: Messages;
}) {
  return <MessagesProvider value={messages}>{children}</MessagesProvider>;
}

/** i18n-ready hook: swap `messages` provider per locale (e.g. fr.json). */
export function useLocaleMessages() {
  return React.useContext(MessagesContext);
}
