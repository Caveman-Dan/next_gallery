import styles from "./Section1.module.scss";

const Section1 = () => (
  <section className={styles.root}>
    <h1>Welcome to Next Gallery</h1>
    <h2>Designed and developed by Dan Marston (2025)</h2>
    <p>
      The aim of this project is, in part to provide a demonstration of my coding practices but also to advanced my
      knowledge of NextJS development. I have opted to create my own components without the use of a component library.
      Although this isn’t entirely reflective of a commercial environment I feel that it better demonstrates my
      aptitude.
    </p>
    <p>
      In the interests of security I will <i>not</i> be implementing the auth token exchange system for Next Gallery.
      Instead I will be using <a href="https://next-auth.js.org/">NextAuth.js</a>. I did actually create a token
      exchange security system a few years ago (
      <a href="http://www.waxworlds.org/dan/secure_login/Home">find it here</a>), however it is advisable to use a third
      party login provider like NextAuth.js due to it being regularly maintained and up to date.
    </p>
    <p>
      Next Gallery is currently a work in progress and is receiving regular updates. Features mentioned here may or may
      not have been implemented yet. Hopefully from reading these pages you will get a good understanding of the concept
      behind the application.
    </p>
    <br />
    <u>
      <h1>Overview</h1>
    </u>
    <p>
      Next Gallery will be a place where you can exhibit your photography and share it with family, friends, clients and
      associates. It will initially be set up for an administrator who can upload albums, authorise viewer accounts and
      set access rights for each album. Upon visiting the app you will automatically be authorised as a guest. Until you
      log in, you will only be able to see albums that the guest user has the privilege to see. Once logged in you will
      have the access to the albums granted to you by the administrator.
    </p>
    <br />
    <h2>The gallery page</h2>
    <p>
      The main gallery page will be a place to exhibit your latest gallery along with a description and a couple of
      selected images from the album. This will be configurable via the administrator settings.
    </p>
    <br />
    <h2>The album view</h2>
    <p>
      When you select an album from the sidebar you will be taken to a gallery of thumbnails. The thumbs are
      horizontally justified in such a way that they should never form a repetitive grid. Selecting an image will take
      you to the image view where you will see a single image in full quality.
    </p>
    <p>
      If your user has the privilege there will be icons on each image to add or remove it from your download basket.
      Across the top will be another menu bar with options to access the basket and some information about how many
      images there are in it. Accessing the basket will provide the options to remove items, clear the basket and
      download a .zip of its contents.
    </p>
    <br />
    <h2>The image view</h2>
    <p>
      After selecting an image in the album view you will be shown the image full screen. Any description associated
      with the image will be visible along with the ability to add or remove it from your download basket.
    </p>
    <br />
    <h2>The basket view</h2>
    <p>
      This will look much like the album view except it will show the contents of your basket. You will also have the
      ability to download the contents of your basket here.
    </p>
  </section>
);

export default Section1;
