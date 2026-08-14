import React, { JSX } from 'react';
import { RichText, Text, TextField } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import { TimePromoProps } from './time-promo.props';

const FALLBACK = {
  heading: 'Night of the Arts once again brings together hundreds of art events.',
  body: `<p>Every Night of the Arts is different, and the Night of the Arts is different for everyone. Since 1989, this event has brought together hundreds of arts events, allowing you to curate your own evening filled with poetry and music, or perhaps film and performance art. Venues can be found throughout the Helsinki metropolitan area, from suburban blocks to prime city-center locations. Art is everywhere, from boutiques to public parks.</p>
<p>The next Night of the Arts will be celebrated on August 20, 2026. Everyone is invited not only to experience art but also to propose and produce it: the program is built together with the residents. Indeed, there are as many Nights of the Arts as there are city dwellers.</p>`,
  ctaText: 'Read more and submit your event »',
  ctaHref: '#',
  timeLabel: 'Time:',
  timeValue: '20.8.2026',
  ticketsLabel: 'Tickets:',
  ticketsValue: 'The event is free of charge',
};

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TicketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M9 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21s-6.7-4.35-9.33-7.4C.7 11.3 1.1 7.9 3.6 6.2c2-1.35 4.55-.85 6.05 1.05L12 10l2.35-2.75c1.5-1.9 4.05-2.4 6.05-1.05 2.5 1.7 2.9 5.1.93 7.4C18.7 16.65 12 21 12 21z" />
  </svg>
);

const textOr = (field: TextField | undefined, fallback: string): string => {
  const value = field?.value ? String(field.value).trim() : '';
  return value || fallback;
};

export const Default = ({ params, fields, page }: TimePromoProps): JSX.Element => {
  const isEditing = Boolean(page?.mode?.isEditing);
  const { styles, RenderingIdentifier: id } = params ?? {};
  const datasource = getDatasource(fields);

  const headingField = getFieldValue(datasource?.heading);
  const bodyField = getFieldValue(datasource?.body);
  const ctaLinkField = getFieldValue(datasource?.ctaLink);
  const timeLabelField = getFieldValue(datasource?.timeLabel);
  const timeValueField = getFieldValue(datasource?.timeValue);
  const ticketsLabelField = getFieldValue(datasource?.ticketsLabel);
  const ticketsValueField = getFieldValue(datasource?.ticketsValue);

  const hasDatasource = Boolean(datasource);
  const headingText = textOr(headingField, hasDatasource ? '' : FALLBACK.heading);
  const timeLabel = textOr(timeLabelField, FALLBACK.timeLabel);
  const timeValue = textOr(timeValueField, hasDatasource && !isEditing ? '' : FALLBACK.timeValue);
  const ticketsLabel = textOr(ticketsLabelField, FALLBACK.ticketsLabel);
  const ticketsValue = textOr(
    ticketsValueField,
    hasDatasource && !isEditing ? '' : FALLBACK.ticketsValue
  );
  const showHeading = Boolean(headingText) || (isEditing && Boolean(headingField));
  const showBody = Boolean(bodyField?.value) || (!hasDatasource && !isEditing) || (isEditing && Boolean(bodyField));
  const showCta =
    Boolean(ctaLinkField?.value?.href) ||
    (!hasDatasource && !isEditing) ||
    (isEditing && Boolean(ctaLinkField));
  const showTime = Boolean(timeValue) || isEditing;
  const showTickets = Boolean(ticketsValue) || isEditing;

  return (
    <section className={cn(componentShell, 'time-promo bg-white py-10 md:py-12', styles)} id={id}>
      {/* Same horizontal shell as Hero image: max 1440px + 15px padding → 1410px content width */}
      <div className="mx-auto w-full max-w-[1440px] px-[15px]">
        <div className="grid grid-cols-1 md:-mx-[15px] md:grid-cols-12">
          {/* Left — intro copy + CTA (HF .element-paragraph has 40px left indent) */}
          <div className="md:col-span-7 md:px-[15px]">
            <div className="ml-0 max-w-[730px] md:ml-[40px]">
              {showHeading && (
                <p className="mb-[27px] font-body text-[18px] font-bold leading-[1.5] text-black">
                  {headingField && (headingField.value || isEditing) ? (
                    <Text field={headingField} tag="span" />
                  ) : (
                    headingText
                  )}
                </p>
              )}

              {showBody && (
                <div
                  className={cn(
                    'time-promo__body font-body text-[18px] leading-[1.5] text-black',
                    '[&_p]:mb-[27px] [&_p]:last:mb-0',
                    '[&_a]:font-bold [&_a]:underline [&_a]:hover:text-accent-pink'
                  )}
                >
                  {bodyField?.value || isEditing ? (
                    <RichText field={bodyField} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: FALLBACK.body }} />
                  )}
                </div>
              )}

              {showCta && (
                <div className="mt-8">
                  {ctaLinkField?.value?.href || isEditing ? (
                    <CompatibleLink
                      field={ctaLinkField}
                      editable={isEditing}
                      className="font-heading text-[25px] font-bold text-black underline underline-offset-4 hover:text-black"
                    />
                  ) : (
                    <a
                      href={FALLBACK.ctaHref}
                      className="font-heading text-[25px] font-bold text-black underline underline-offset-4 hover:text-black"
                    >
                      {FALLBACK.ctaText}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right — HF col-md-5 col-lg-4 offset-lg-1 so the box lines up with the hero image edge */}
          <div className="mt-10 md:col-span-5 md:mt-0 md:px-[15px] lg:col-span-4 lg:col-start-9">
            <ul className="aside-list m-0 mb-8 list-none border border-[#d4d4d4] p-[30px]">
              {showTime && (
                <li className="aside-list__item mb-6 flex list-none gap-2.5 last:mb-0">
                  <span className="aside-list-item-icon flex h-[30px] w-[30px] shrink-0 items-center justify-center text-black">
                    <ClockIcon />
                  </span>
                  <div className="aside-list-item-content min-w-0 pt-1">
                    <h3 className="aside-list-item-title mb-1.5 font-heading text-[15px] font-bold leading-tight text-black">
                      {timeLabelField && (timeLabelField.value || isEditing) ? (
                        <Text field={timeLabelField} tag="span" />
                      ) : (
                        timeLabel
                      )}
                    </h3>
                    <p className="m-0 font-body text-[18px] leading-[1.5] text-black">
                      {timeValueField && (timeValueField.value || isEditing) ? (
                        <Text field={timeValueField} tag="span" />
                      ) : (
                        timeValue
                      )}
                    </p>
                  </div>
                </li>
              )}

              {showTickets && (
                <li className="aside-list__item mb-0 flex list-none gap-2.5">
                  <span className="aside-list-item-icon flex h-[30px] w-[30px] shrink-0 items-center justify-center text-black">
                    <TicketIcon />
                  </span>
                  <div className="aside-list-item-content min-w-0 pt-1">
                    <h3 className="aside-list-item-title mb-1.5 font-heading text-[15px] font-bold leading-tight text-black">
                      {ticketsLabelField && (ticketsLabelField.value || isEditing) ? (
                        <Text field={ticketsLabelField} tag="span" />
                      ) : (
                        ticketsLabel
                      )}
                    </h3>
                    <p className="m-0 font-body text-[18px] leading-[1.5] text-black">
                      {ticketsValueField && (ticketsValueField.value || isEditing) ? (
                        <Text field={ticketsValueField} tag="span" />
                      ) : (
                        ticketsValue
                      )}
                    </p>
                  </div>
                </li>
              )}
            </ul>

            <button type="button" className="time-promo__favourite add-fav-btn">
              <span>Add as favourite</span>
              <HeartIcon />
            </button>
          </div>
        </div>
      </div>

      {isEditing && !datasource && (
        <p className="is-empty-hint mx-auto mt-6 max-w-[1440px] px-[15px] font-body text-sm text-black/70">
          Time Promo: configure heading, body, CTA, time, and tickets fields in the datasource.
        </p>
      )}
    </section>
  );
};
