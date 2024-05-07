import { Fragment, MouseEvent, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { Snippet } from "@nextui-org/react";
import { DEFAULT_I18N_NAMESPACE } from "../../../constants";
import { EnvVarSnippet } from "@/types";

type Props = {
  values: Array<EnvVarSnippet>;
  showEmptyState: boolean;
};

export function Snippets({ values = [], showEmptyState = false }: Props) {
  const { t: tCommon } = useTranslation(DEFAULT_I18N_NAMESPACE);
  const isValuesEmpty = values.length === 0;
  const showEmpty = showEmptyState || isValuesEmpty;

  const handleSnippetClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => e.stopPropagation(),
    []
  );

  if (showEmpty)
    return (
      <p
        className={`m-auto text-center sm:text-lg md:text-2xl font-bold ${
          showEmptyState ? "text-success-900" : "text-default-600"
        }`}
      >
        {tCommon("dropZonePlaceholder")}
      </p>
    );

  return (
    <div className="flex flex-col sm:flex-row sm:justify-center sm:flex-wrap gap-8">
      {values.map((snippet, index) => (
        <div
          key={String(index)}
          onClick={handleSnippetClick}
          className="cursor-text"
        >
          <p className="flex flex-col mb-1 text-sm text-default-600">
            <span>
              {tCommon("snippet.name")}: {snippet.name}
            </span>
            <span>
              {tCommon("snippet.type")}:{" "}
              {tCommon(`snippet.types.${snippet.type}`)}
            </span>
          </p>
          <Snippet
            tooltipProps={{
              content: tCommon("copyToClipboard"),
            }}
            classNames={{
              base: `sm:min-w-60 max-w-full mx-auto p-4 ${
                snippet.envVars?.length > 0 ? "items-start" : "items-center"
              }`,
              pre: "text-wrap leading-5 break-all mb-3 last-of-type:mb-0",
              symbol: "hidden",
              copyButton: "border-1 border-default",
            }}
          >
            {snippet.envVars.map((envVar, index) => (
              <Fragment key={String(index)}>{envVar}</Fragment>
            ))}
          </Snippet>
        </div>
      ))}
    </div>
  );
}
