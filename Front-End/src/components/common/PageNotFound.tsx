

const PageNotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-cover bg-center"
            style={{ backgroundImage: "url('/404_Bg_Image.jpg')" }}>
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404 Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-6">The page you requested does not exist.</p>
            <a
                href="/"
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-3xl hover:bg-blue-700 transition"
                >
                HOME
                <i className="fa fa-caret-right ml-2" aria-hidden="true"></i>
            </a>
        </div>
    </div>
  );
};

export default PageNotFound;