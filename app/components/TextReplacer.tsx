'use client';
import { useEffect, useRef } from 'react';

type Rule = {
  selectors: string[]; // container selectors to prefer
  oldText: string;
  newText: string;
};

const RULES: Rule[] = [
  {
    selectors: ['#step-3', '[data-step="3"]', '.screen-3'],
    oldText: 'Em qual refeitório costuma fazer suas refeições',
    newText: 'Em qual refeitório costuma fazer suas refeições ?',
  },
  {
    selectors: ['#step-5', '[data-step="5"]', '.screen-5'],
    oldText: 'Compartilhe esta campanha com outras mulheres do seu setor',
    newText: 'Compartilhe esta campanha com outras mulheres do seu setor!',
  },
];

export default function TextReplacer() {
  const appliedRef = useRef<Record<number, boolean>>({});
  const obsRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const isInertNode = (node: Node) => {
      const parent = (node as Node & { parentElement?: HTMLElement }).parentElement;
      if (!parent) return false;
      const tag = parent.tagName?.toLowerCase();
      return tag === 'script' || tag === 'style' || tag === 'noscript';
    };

    const replaceInTextNode = (node: Node, oldText: string, newText: string) => {
      if (node.nodeType !== Node.TEXT_NODE) return false;
      if (isInertNode(node)) return false;
      const value = node.nodeValue || '';
      if (value.includes(oldText)) {
        node.nodeValue = value.split(oldText).join(newText);
        return true;
      }
      return false;
    };

    const walkAndReplace = (root: Node, oldText: string, newText: string) => {
      let replaced = false;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      let n: Node | null = walker.nextNode();
      while (n) {
        try {
          if (replaceInTextNode(n, oldText, newText)) replaced = true;
        } catch (e) {
          // ignore per-node errors
        }
        n = walker.nextNode();
      }
      return replaced;
    };

    const findContainerForSelectors = (selectors: string[]) => {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
      }
      return null;
    };

    // For each rule try initial pass preferring its container, otherwise fallback to body.
    RULES.forEach((rule, idx) => {
      const root = findContainerForSelectors(rule.selectors) || document.body;
      if (walkAndReplace(root, rule.oldText, rule.newText)) {
        appliedRef.current[idx] = true;
      }
    });

    // If all applied, nothing more to do.
    const allApplied = RULES.every((_, idx) => appliedRef.current[idx]);
    if (allApplied) return;

    // Temporary observer to catch late-rendered DOM. Disconnect after first successful application per rule or after timeout.
    const observer = new MutationObserver((mutations) => {
      RULES.forEach((rule, idx) => {
        if (appliedRef.current[idx]) return;
        const root = findContainerForSelectors(rule.selectors) || document.body;
        // try scanning only added nodes for performance
        for (const m of mutations) {
          if (m.type === 'childList' && m.addedNodes.length) {
            for (const node of Array.from(m.addedNodes)) {
              try {
                if (walkAndReplace(node, rule.oldText, rule.newText)) {
                  appliedRef.current[idx] = true;
                }
              } catch (e) {
                // ignore
              }
            }
          }
        }
      });

      // if all applied, disconnect early
      if (RULES.every((_, idx) => appliedRef.current[idx])) {
        if (obsRef.current) {
          obsRef.current.disconnect();
          obsRef.current = null;
        }
      }
    });

    obsRef.current = observer;
    observer.observe(document.body, { childList: true, subtree: true });

    const timeout = setTimeout(() => {
      if (obsRef.current) {
        obsRef.current.disconnect();
        obsRef.current = null;
      }
    }, 5000);

    return () => {
      if (obsRef.current) obsRef.current.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
