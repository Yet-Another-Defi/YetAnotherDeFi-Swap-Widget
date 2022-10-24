export const isIOS =
  typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent || '');

export const isSafari =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '');

export function scrollTo(offset: number, callback = () => {}) {
  const fixedOffset = offset.toFixed();
  const onScroll = function () {
    if (window.pageYOffset.toFixed() === fixedOffset) {
      window.removeEventListener('scroll', onScroll);
      callback();
    }
  };

  window.addEventListener('scroll', onScroll);
  onScroll();
  window.scrollTo({
    top: offset,
    behavior: 'smooth',
  });
}
