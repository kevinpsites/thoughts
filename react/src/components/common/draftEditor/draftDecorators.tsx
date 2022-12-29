import { useThreadContext } from "components/pages/threadPage/threadPage";
import { ReactChild, ReactFragment, ReactPortal } from "react";
import { DecoratorTypes } from "types/draftEditorTypes";

export function findWithRegex(
  regex: RegExp,
  contentBlock: { getText: () => any },
  callback: (arg0: any, arg1: any) => void
) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export const HANDLE_REGEX = /@[\w]+/g;
export const HASHTAG_REGEX = /#[\w?!:-\u0590-\u05ff]+/g;

export function handleStrategy(
  contentBlock: any,
  callback: any,
  contentState: any
) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

export function hashtagStrategy(
  contentBlock: any,
  callback: any,
  contentState: any
) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

export const decoratorStyles = {
  handle: {
    color: "rgba(98, 177, 254, 1.0)",
    // unicodeBidi: "bidi-override"
  },
  hashtag: {
    color: "rgba(95, 184, 138, 1.0)",
  },
};

export const HandleSpan = (props: {
  offsetKey: any;
  children:
    | boolean
    | ReactChild
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => {
  return (
    <span style={decoratorStyles.handle} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};

export const HashtagSpan = (props: {
  offsetKey: any;
  children:
    | boolean
    | ReactChild
    | ReactFragment
    | ReactPortal
    | null
    | undefined
    | any;
}) => {
  const { searchHashTag } = useThreadContext();
  return (
    <span
      // style={decoratorStyles.hashtag}
      data-offset-key={props.offsetKey}
      className={"hashtag-span draft-decorator-hashtag-style"}
      data-value={props.children}
      onClick={() => {
        searchHashTag(
          props.children && props.children[0] && props.children[0].props?.text
        );
      }}
    >
      {props.children}
    </span>
  );
};

export const createHashtagDecorator = () => ({
  strategy: hashtagStrategy,
  component: HashtagSpan,
});

export const createHandleDecorator = () => ({
  strategy: handleStrategy,
  component: HandleSpan,
});

export const generateDecoratorTypes = (types: DecoratorTypes[]) => {
  let finalDecorators: any[] = [];
  types.forEach((type) => {
    if (type === "HashTag") {
      finalDecorators.push(createHashtagDecorator());
    } else if (type === "Handle") {
      finalDecorators.push(createHandleDecorator());
    }
  });
  return finalDecorators;
};
