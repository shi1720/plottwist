'use client';
import { useEffect, useRef } from 'react';
import type { Answer, PackId, Scene } from '@/lib/engine/types';
interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown) => unknown;
}
type Context = {
  registerTool: (
    tool: Tool,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
type QuizState = {
  ready: boolean;
  packId: PackId;
  cursor: number;
  scene: Scene;
  answers: Answer[];
  choose: (id: string) => void;
  next: () => void;
};
export function useQuizTools(state: QuizState) {
  const current = useRef(state);
  useEffect(() => {
    current.current = state;
  });
  useEffect(() => {
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context?.registerTool || !state.ready) return;
    const lifecycle = new AbortController();
    const tools: Tool[] = [
      {
        name: 'read_quiz_scene',
        description:
          'Read the current episode scene, choices, and selected answer.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
        execute: () => {
          const s = current.current;
          return {
            pack: s.packId,
            scene: s.scene.id,
            title: s.scene.title,
            setting: s.scene.setting,
            detail: s.scene.detail,
            choices: s.scene.choices.map((c) => ({ id: c.id, text: c.text })),
            selected:
              s.answers.find((a) => a.sceneId === s.scene.id)?.choiceId ?? null,
          };
        },
      },
      {
        name: 'select_quiz_answer',
        description:
          'Select an answer on the current scene. Does not move to the next scene or complete the quiz.',
        inputSchema: {
          type: 'object',
          properties: { choiceId: { type: 'string' } },
          required: ['choiceId'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false },
        execute: async (input) => {
          if (
            !input ||
            typeof input !== 'object' ||
            !('choiceId' in input) ||
            typeof input.choiceId !== 'string'
          )
            throw new Error('A choiceId is required');
          current.current.choose(input.choiceId);
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve()),
          );
          return { selected: input.choiceId };
        },
      },
    ];
    for (const tool of tools) {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {
        /* Optional browser capability; normal quiz remains available. */
      }
    }
    return () => lifecycle.abort();
  }, [state.ready]);
}
