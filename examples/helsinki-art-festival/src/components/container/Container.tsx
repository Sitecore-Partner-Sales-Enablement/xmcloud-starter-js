import React, { JSX } from 'react';
import componentMap from '.sitecore/component-map';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { cn, componentShell } from 'lib/utils';
import { ContainerProps } from './container.props';

const Container = ({ params, rendering, page }: ContainerProps): JSX.Element => {
  const {
    styles,
    RenderingIdentifier: id,
    BackgroundImage: backgroundImage,
    DynamicPlaceholderId,
  } = params;
  const phKey = `container-${DynamicPlaceholderId}`;

  const mediaUrlPattern = new RegExp(/mediaurl=\"([^"]*)\"/, 'i');

  let backgroundStyle: { [key: string]: string } = {};

  if (backgroundImage && backgroundImage.match(mediaUrlPattern)) {
    const mediaUrl = backgroundImage.match(mediaUrlPattern)?.[1] || '';

    backgroundStyle = {
      backgroundImage: `url('${mediaUrl}')`,
    };
  }

  return (
    <section className={cn(componentShell, 'container-default', styles)} id={id}>
      <div
        className="component-content mx-auto w-full max-w-[1400px] px-4 md:px-8"
        style={backgroundStyle}
      >
        <div className="row">
          <AppPlaceholder
            name={phKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </div>
      </div>
    </section>
  );
};

export const Default = ({ params, rendering, page }: ContainerProps): JSX.Element => {
  const styles = params?.styles?.split(' ');

  return styles?.includes('container') ? (
    <div className="container-wrapper w-full">
      <Container params={params} rendering={rendering} page={page} />
    </div>
  ) : (
    <Container params={params} rendering={rendering} page={page} />
  );
};
