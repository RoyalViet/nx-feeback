import Router from 'next/router';
import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

// Add Router event handlers
Router.events.on('routeChangeStart', (url, { shallow }) => {
  if (!shallow) {
    NProgress.start();
  }
});

Router.events.on('routeChangeComplete', (url, { shallow }) => {
  if (!shallow) {
    NProgress.done();
  }
});

Router.events.on('routeChangeError', (url, { shallow }) => {
  if (!shallow) {
    NProgress.done();
  }
});

export default NProgress;
