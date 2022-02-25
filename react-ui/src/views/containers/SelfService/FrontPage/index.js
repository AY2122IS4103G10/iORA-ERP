import { Link } from "react-router-dom";

export function FrontPage() {
    return (
        <div className="grid gap-5 mt-20">
            <div className="max-w-3xl mx-auto">
                <Link to="/ss/memberLogin">
                    <button
                        type="button"
                        className=
                        "inline-flex items-center px-10 py-10 box-content h-32 w-55 border border-black text-2xl font-bold rounded-lg shadow-lg text-black bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        I am a member
                    </button>
                </Link>
            </div>
            <div className="max-w-3xl mx-auto">
                <Link to="/ss/order">
                    <button
                        type="button"
                        className=
                        "inline-flex items-center px-5 py-10 box-content h-32 w-55 border border-black text-2xl font-bold rounded-lg shadow-lg text-black bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        I am not a member
                    </button>
                </Link>
            </div>
        </div>
    )
}