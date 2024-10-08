import Shop from './components/shop';
import heroImage from './assets/images/hero.png';

const App = () => {
  return (
    <div className="poppins">
      <header>
        <section className="border-t border-b pb-10 pt-10">
          <div className="flex container mx-auto">
            <img src={heroImage} alt="" className="rounded shadow h-[180px]" />
            <div className="ml-8">
              <h1 className="mb-3 text-2xl font-bold">Teacher Booker Coffee Shop</h1>
              <div>
                Indulge in a personalized coffee experience like never before. Choose from our curated selection of premium coffee blends or craft your own unique brew with our easy-to-use customization options. Whether you're a latte lover, an espresso enthusiast, or craving something sweet and creamy, Coffee Corner lets you order your perfect cup just the way you like it—delivered fresh and fast. Start your day right with the coffee that’s made for you, by you.
              </div>
            </div>
          </div>
        </section>
      </header>
      <main className="bg-gray-100 shadow-inner">
        <Shop />
      </main>
      <footer>
        <div className="container mx-auto py-4 text-center">
          <p>&copy; 2021 Teacher Booker Coffee Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
