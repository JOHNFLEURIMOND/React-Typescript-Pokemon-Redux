import React from "react";
import { Button } from "../src/Button";
import { Header } from "../src/Header";
import { Tooltip } from "../src/Tooltip";
import "./4-Tooltip.stories.css";

export default {
  title: "Tooltip",
};

export const Positions = (): React.ReactElement => (
  <>
    <Header as="h1" my={2}>
      Tooltip Positions
    </Header>

    <div className="tooltip-position-demo">
      <div className="tooltip-top">
        <Tooltip
          content="To create an agent, you must belong to a team that has access to a workspace."
          inverted
          position="top"
          on="hover"
          wide
          trigger={<Button variant="primary">Tooltip on Top</Button>}
        />
      </div>
      <div className="tooltip-bottom">
        <Tooltip
          content="To create an agent, you must belong to a team that has access to a workspace"
          inverted
          on="hover"
          position="bottom"
          wide
          trigger={<Button variant="primary">Tooltip on Bottom</Button>}
        />
      </div>
      <div className="tooltip-right">
        <Tooltip
          content="To create an agent, you must belong to a team that has access to a workspace"
          inverted
          on="hover"
          position="right"
          pinned
          trigger={<Button variant="primary">Tooltip on Right</Button>}
        />
      </div>
      <div className="tooltip-left">
        <Tooltip
          content="To create an agent, you must belong to a team that has access to a workspace"
          inverted
          on="hover"
          position="left"
          pinned
          trigger={<Button variant="primary">Tooltip on Left</Button>}
        />
      </div>
    </div>
  </>
);

export const Widths = (): React.ReactElement => (
  <>
    <Header as="h1" my={2}>
      Tooltip Widths
    </Header>
    <div className="tooltip-width-demo">
      <div className="tooltip-normal">
        <Tooltip
          content="Default tooltip width"
          on="hover"
          position="right"
          trigger={
            <span className="tooltip-trigger" role="img" aria-label="gemstone">
              💎
            </span>
          }
        />
      </div>
      <div className="tooltip-wide">
        <Tooltip
          content="A `wide` tooltip with some longer description text that will explain the feature"
          wide
          on="hover"
          position="right"
          trigger={
            <span className="tooltip-trigger" role="img" aria-label="gemstone">
              💎
            </span>
          }
        />
      </div>
      <div className="tooltip-very-wide">
        <Tooltip
          content="A much longer tooltip (use `wide='very'` ) text that goes on forever and ever. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula eu metus id faucibus. Sed sit amet vestibulum orci. Donec finibus lobortis mi id efficitur. Nunc venenatis, ligula eu fermentum mattis, enim turpis eleifend sem, at efficitur tellus nisi non odio. Integer suscipit pretium massa, sit amet scelerisque augue dignissim sit amet."
          wide="very"
          on="hover"
          position="right"
          trigger={
            <span className="tooltip-trigger" role="img" aria-label="gemstone">
              💎
            </span>
          }
        />
      </div>
      <div className="tooltip-custom">
        <Tooltip
          content="You can use css to override the width of the tooltip by setting the max-width property. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula eu metus id faucibus. Sed sit amet vestibulum orci. Donec finibus lobortis mi id efficitur. Nunc venenatis, ligula eu fermentum mattis, enim turpis eleifend sem, at efficitur tellus nisi non odio. Integer suscipit pretium massa, sit amet scelerisque augue dignissim sit amet."
          on="hover"
          position="right"
          className="tooltip-custom-width"
          trigger={
            <span className="tooltip-trigger" role="img" aria-label="gemstone">
              💎
            </span>
          }
        />
      </div>

      <div className="tooltip-fluid">
        <Tooltip
          content="Use the `flowing` prop to remove the max-width altogether to make it flow to fit the content."
          flowing
          on="hover"
          position="right"
          trigger={
            <span className="tooltip-trigger" role="img" aria-label="gemstone">
              💎
            </span>
          }
        />
      </div>
    </div>
  </>
);
