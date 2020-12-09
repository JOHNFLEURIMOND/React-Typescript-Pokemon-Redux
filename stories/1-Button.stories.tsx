import React from "react";
import { action } from "@storybook/addon-actions";
import { Button } from "../src/Button";
import { Header } from "../src/Header";

export default {
  title: "Button",
};

export const variations = (): React.ReactElement => (
  <>
    <Header as="h1" my={2}>
      Button Variations
    </Header>
    <Header as="h2" my={2}>
      Primary
    </Header>
    <Button
      variant="primary"
      aria-label="Primary Small Button"
      onClick={action("clicked")}
      mb={2}
      mr={1}
    >
      Start a Scan
    </Button>

    <Button variant="primary" onClick={action("clicked")} disabled mb={2}>
      Start a Scan
    </Button>

    <Header as="h2" my={2}>
      Secondary (default)
    </Header>

    <Button
      variant="secondary"
      aria-label="Secondary Small Button"
      onClick={action("clicked")}
      mb={2}
      mr={1}
    >
      Start a Scan
    </Button>

    <Button variant="secondary" onClick={action("clicked")} disabled mb={2}>
      Start a Scan
    </Button>

    <Header as="h2" my={2}>
      Tertiary
    </Header>

    <Button
      variant="tertiary"
      aria-label="Tertiary Small Button"
      onClick={action("clicked")}
      mb={2}
      mr={1}
    >
      Start a Scan
    </Button>

    <Button variant="tertiary" onClick={action("clicked")} disabled mb={2}>
      Start a Scan
    </Button>

    <Header as="h2" my={2}>
      Urgent Primary
    </Header>

    <Button
      variant="urgentPrimary"
      aria-label="Urgent Small Button"
      onClick={action("clicked")}
      mb={2}
      mr={1}
    >
      Start a Scan
    </Button>

    <Button variant="urgentPrimary" onClick={action("clicked")} disabled mb={2}>
      Start a Scan
    </Button>

    <Header as="h2" my={2}>
      Urgent Secondary
    </Header>

    <Button
      variant="urgentSecondary"
      aria-label="Secondary Urgent Small Button"
      onClick={action("clicked")}
      mb={2}
      mr={1}
    >
      Start a Scan
    </Button>

    <Button
      variant="urgentSecondary"
      onClick={action("clicked")}
      disabled
      mb={2}
    >
      Start a Scan
    </Button>
  </>
);

export const sizes = (): React.ReactElement => (
  <>
    <Header as="h1" my={2}>
      Button Sizes
    </Header>
    <Header as="h2" my={2}>
      Small (default)
    </Header>
    <Button
      variant="primary"
      aria-label="Primary Small Button"
      onClick={action("clicked")}
      size="small"
      mb={2}
      mr={1}
    >
      Small
    </Button>
    <Button
      variant="secondary"
      onClick={action("clicked")}
      size="small"
      mb={2}
      mr={1}
    >
      Small
    </Button>

    <Button
      variant="tertiary"
      onClick={action("clicked")}
      size="small"
      mb={2}
      mr={1}
    >
      Small
    </Button>

    <Button
      variant="urgentPrimary"
      onClick={action("clicked")}
      size="small"
      mb={2}
      mr={1}
    >
      Small
    </Button>

    <Button
      variant="urgentSecondary"
      onClick={action("clicked")}
      size="small"
      mb={2}
      mr={1}
    >
      Small
    </Button>

    <Header as="h2" my={2}>
      Medium
    </Header>
    <Button
      variant="primary"
      aria-label="Primary Small Button"
      onClick={action("clicked")}
      size="medium"
      mb={2}
      mr={1}
    >
      Medium
    </Button>
    <Button
      variant="secondary"
      onClick={action("clicked")}
      size="medium"
      mb={2}
      mr={1}
    >
      Medium
    </Button>
    <Button
      variant="tertiary"
      onClick={action("clicked")}
      size="medium"
      mb={2}
      mr={1}
    >
      Medium
    </Button>
    <Button
      variant="urgentPrimary"
      onClick={action("clicked")}
      size="medium"
      mb={2}
      mr={1}
    >
      Medium
    </Button>
    <Button
      variant="urgentSecondary"
      onClick={action("clicked")}
      size="medium"
      mb={2}
      mr={1}
    >
      Medium
    </Button>
    <Header as="h2" my={2}>
      Large
    </Header>

    <Button
      variant="primary"
      aria-label="Primary Small Button"
      onClick={action("clicked")}
      size="large"
      mb={2}
      mr={1}
    >
      Large
    </Button>
    <Button
      variant="secondary"
      onClick={action("clicked")}
      size="large"
      mb={2}
      mr={1}
    >
      Large
    </Button>
    <Button
      variant="tertiary"
      onClick={action("clicked")}
      size="large"
      mb={2}
      mr={1}
    >
      Large
    </Button>
    <Button
      variant="urgentPrimary"
      onClick={action("clicked")}
      size="large"
      mb={2}
      mr={1}
    >
      Large
    </Button>
    <Button
      variant="urgentSecondary"
      onClick={action("clicked")}
      size="large"
      mb={2}
      mr={1}
    >
      Large
    </Button>
  </>
);

variations.story = {
  parameters: {
    notes:
      "Used to highlight the most important actions. Don’t use more than one primary button within a section or view.",
  },
};

sizes.story = {
  parameters: {
    notes:
      "Used to highlight the most important actions. Don’t use more than one primary button within a section or view.",
  },
};
