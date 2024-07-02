// components/ImageNode.tsx
import { DecoratorNode } from 'lexical';
import { LexicalEditor, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import React from 'react';
import Image from 'next/image';

type SerializedImageNode = Spread<
  {
    src: string;
    alt: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt } = serializedNode;
    return new ImageNode(src, alt);
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      alt: this.__alt,
      type: 'image',
      version: 1,
    };
  }

  constructor(src: string, alt: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  createDOM(): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return <Image src={this.__src} alt={this.__alt} width={500} height={300} />;
  }
}

export function $createImageNode(src: string, alt: string): ImageNode {
  return new ImageNode(src, alt);
}

export function $isImageNode(node: any): node is ImageNode {
  return node instanceof ImageNode;
}
