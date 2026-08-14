import React, { JSX } from 'react';
import componentMap from '.sitecore/component-map';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { cn, componentShell } from 'lib/utils';
import { ColumnNumber, ColumnSplitterProps } from './column-splitter.props';

export const Default = ({ params, rendering, page }: ColumnSplitterProps): JSX.Element => {
  const { EnabledPlaceholders, RenderingIdentifier: id, styles } = params;

  const enabledColumns = EnabledPlaceholders?.split(',') ?? [];

  return (
    <section
      className={cn(
        'row',
        componentShell,
        'column-splitter box-border mx-0 max-w-none gap-y-6 px-0 md:gap-y-8 [&>div]:px-2 md:[&>div]:px-3',
        styles
      )}
      id={id}
    >
      {enabledColumns.map((columnNum, index) => {
        const num = Number(columnNum) as ColumnNumber;
        const columnWidth = params[`ColumnWidth${num}`] ?? '';
        const columnStyle = params[`Styles${num}`] ?? '';
        const columnClassNames = `${columnWidth} ${columnStyle}`.trim();

        return (
          <div key={index} className={columnClassNames}>
            <div className="row">
              <AppPlaceholder
                name={`column-${columnNum}-{*}`}
                rendering={rendering}
                page={page}
                componentMap={componentMap}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};
