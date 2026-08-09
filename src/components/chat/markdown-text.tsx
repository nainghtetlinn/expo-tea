import { useMemo } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type InlineNode =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "italic"; content: string }
  | { type: "boldItalic"; content: string }
  | { type: "code"; content: string };

type BlockNode =
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "unorderedList"; items: InlineNode[][] }
  | { type: "orderedList"; items: { index: number; children: InlineNode[] }[] };

/**
 * Parse inline markdown tokens: ***bold italic***, **bold**, *italic*, `code`
 */
function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  // Match bold-italic (***), bold (**), italic (*), or inline code (`)
  const regex = /(\*{3})(.*?)\1|(\*{2})(.*?)\3|(\*)(.*?)\5|(`)(.*?)\7/g;
  let lastIndex = 0;

  // Use matchAll to avoid assigning inside the condition
  for (const match of text.matchAll(regex)) {
    // Push any text before this match
    if (match.index > lastIndex) {
      nodes.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    if (match[1] === "***") {
      nodes.push({ type: "boldItalic", content: match[2] });
    } else if (match[3] === "**") {
      nodes.push({ type: "bold", content: match[4] });
    } else if (match[5] === "*") {
      nodes.push({ type: "italic", content: match[6] });
    } else if (match[7] === "`") {
      nodes.push({ type: "code", content: match[8] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Push any remaining text
  if (lastIndex < text.length) {
    nodes.push({ type: "text", content: text.slice(lastIndex) });
  }

  return nodes;
}

/**
 * Parse markdown text into block-level nodes (paragraphs and lists).
 */
function parseBlocks(text: string): BlockNode[] {
  const lines = text.split("\n");
  const blocks: BlockNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Unordered list item: starts with "- " or "* " (but not **bold**)
    const ulMatch = line.match(/^[\s]*[-][\s]+(.*)/);
    if (ulMatch) {
      const items: InlineNode[][] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[\s]*[-][\s]+(.*)/);
        if (!m) break;
        items.push(parseInline(m[1]));
        i++;
      }
      blocks.push({ type: "unorderedList", items });
      continue;
    }

    // Ordered list item: starts with "1. ", "2. ", etc.
    const olMatch = line.match(/^[\s]*(\d+)\.[\s]+(.*)/);
    if (olMatch) {
      const items: { index: number; children: InlineNode[] }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[\s]*(\d+)\.[\s]+(.*)/);
        if (!m) break;
        items.push({
          index: Number.parseInt(m[1], 10),
          children: parseInline(m[2]),
        });
        i++;
      }
      blocks.push({ type: "orderedList", items });
      continue;
    }

    // Heading lines: strip # prefix but treat as bold paragraph
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      blocks.push({
        type: "paragraph",
        children: [{ type: "bold", content: headingMatch[2] }],
      });
      i++;
      continue;
    }

    // Regular paragraph (may be empty line)
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Collect consecutive non-special lines into a paragraph
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      if (
        l.trim() === "" ||
        l.match(/^[\s]*[-][\s]+(.*)/) ||
        l.match(/^[\s]*(\d+)\.[\s]+(.*)/) ||
        l.match(/^(#{1,6})\s+(.*)/)
      ) {
        break;
      }
      paragraphLines.push(l);
      i++;
    }
    blocks.push({
      type: "paragraph",
      children: parseInline(paragraphLines.join(" ")),
    });
  }

  return blocks;
}

function InlineContent({
  nodes,
  color,
}: {
  nodes: InlineNode[];
  color: string;
}) {
  const theme = useTheme();

  return (
    <Text style={{ color }} variant="bodyLarge">
      {nodes.map((node, i) => {
        switch (node.type) {
          case "bold":
            return (
              <Text key={i} style={{ color, fontWeight: "bold" }}>
                {node.content}
              </Text>
            );
          case "italic":
            return (
              <Text key={i} style={{ color, fontStyle: "italic" }}>
                {node.content}
              </Text>
            );
          case "boldItalic":
            return (
              <Text
                key={i}
                style={{ color, fontWeight: "bold", fontStyle: "italic" }}
              >
                {node.content}
              </Text>
            );
          case "code":
            return (
              <Text
                key={i}
                style={{
                  backgroundColor: theme.colors.surfaceDisabled,
                  borderRadius: 4,
                  color,
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              >
                {" "}
                {node.content}{" "}
              </Text>
            );
          default:
            return node.content;
        }
      })}
    </Text>
  );
}

export function MarkdownText({
  children,
  color,
  cursor,
}: {
  children: string;
  color: string;
  cursor?: boolean;
}) {
  const blocks = useMemo(() => parseBlocks(children), [children]);

  return (
    <View>
      {blocks.map((block, i) => {
        const isLast = i === blocks.length - 1;

        switch (block.type) {
          case "paragraph":
            return (
              <Text
                key={i}
                style={{
                  color,
                  marginBottom: isLast ? 0 : 6,
                }}
                variant="bodyLarge"
              >
                <InlineContent color={color} nodes={block.children} />
                {isLast && cursor ? "▍" : ""}
              </Text>
            );

          case "unorderedList":
            return (
              <View key={i} style={{ marginBottom: isLast ? 0 : 6 }}>
                {block.items.map((item, j) => (
                  <View
                    key={j}
                    style={{
                      flexDirection: "row",
                      marginBottom: 2,
                      paddingLeft: 8,
                    }}
                  >
                    <Text
                      style={{ color, marginRight: 6, marginTop: 1 }}
                      variant="bodyLarge"
                    >
                      •
                    </Text>
                    <View style={{ flex: 1 }}>
                      <InlineContent color={color} nodes={item} />
                    </View>
                  </View>
                ))}
                {isLast && cursor ? (
                  <Text style={{ color }} variant="bodyLarge">
                    ▍
                  </Text>
                ) : null}
              </View>
            );

          case "orderedList":
            return (
              <View key={i} style={{ marginBottom: isLast ? 0 : 6 }}>
                {block.items.map((item, j) => (
                  <View
                    key={j}
                    style={{
                      flexDirection: "row",
                      marginBottom: 2,
                      paddingLeft: 8,
                    }}
                  >
                    <Text style={{ color, marginRight: 6 }} variant="bodyLarge">
                      {item.index}.
                    </Text>
                    <View style={{ flex: 1 }}>
                      <InlineContent color={color} nodes={item.children} />
                    </View>
                  </View>
                ))}
                {isLast && cursor ? (
                  <Text style={{ color }} variant="bodyLarge">
                    ▍
                  </Text>
                ) : null}
              </View>
            );

          default:
            return null;
        }
      })}
      {blocks.length === 0 && cursor ? (
        <Text style={{ color }} variant="bodyLarge">
          ▍
        </Text>
      ) : null}
    </View>
  );
}
