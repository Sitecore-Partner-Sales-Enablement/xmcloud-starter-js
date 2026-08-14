import React, { JSX } from 'react';
import componentMap from '.sitecore/component-map';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { cn, componentShell } from 'lib/utils';
import { RowNumber, RowSplitterProps } from './row-splitter.props';

export const Default = ({ params, rendering, page }: RowSplitterProps): JSX.Element => {
  const enabledPlaceholders = params.EnabledPlaceholders?.split(',') ?? [];
  const id = params.RenderingIdentifier;

  return (
    <section className={cn(componentShell, 'row-splitter box-border space-y-8 md:space-y-12', params.styles)} id={id}>
      {enabledPlaceholders.map((ph, index) => {
        const num = Number(ph) as RowNumber;
        const placeholderKey = `row-${num}-{*}`;
        const rowStyles = `${params[`Styles${num}`] ?? ''}`.trimEnd();

        return (
          <section key={index} className={cn('container-fluid px-0', rowStyles)}>
            <div>
              <div className="row">
                <AppPlaceholder
                  name={placeholderKey}
                  rendering={rendering}
                  page={page}
                  componentMap={componentMap}
                />
              </div>
            </div>
          </section>
        );
      })}
    </section>
  );
};
