import { createCn } from "cn/config"

/**
 * Class merging that knows Relay's type roles. Without this, `text-body` (a
 * font-size role) and `text-on-surface` (a color) look like the same group and
 * one of them is dropped. Role names come from tokens/src/typography.json.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "title",
            "heading",
            "body",
            "body-strong",
            "data",
            "metric",
            "label",
            "overline",
          ],
        },
      ],
    },
  },
})
