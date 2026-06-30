"use client";

import { useCallback, useState } from "react";

interface UseDisclosureOptions {
  defaultOpen?: boolean;
}

export function useDisclosure({ defaultOpen = false }: UseDisclosureOptions = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle, setIsOpen };
}
