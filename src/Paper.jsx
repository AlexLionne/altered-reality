import React from 'react';

const Paper = () => {
    function formatMetric(value) {
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace('.0', '') + ' M';
        if (value >= 1_000) return (value / 1_000).toFixed(1).replace('.0', '') + ' k';
        return value.toString();
    }

    const generatePosts = (count = 100) => {
        const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Faythe', 'Grace', 'Heidi'];
        const handles = ['@alice', '@bob', '@charlie', '@david', '@eve', '@faythe', '@grace', '@heidi'];
        const lorem = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.',
            'Nam nec ante. Sed lacinia, urna non tincidunt mattis.',
            'Curabitur sodales ligula in libero.',
            'Sed dignissim lacinia nunc.',
            'Curabitur tortor. Pellentesque nibh.',
            'Aenean quam. In scelerisque sem at dolor.',
            'Maecenas mattis. Sed convallis tristique sem.'
        ];

        const containerWidth = 800;
        const containerHeight = 800;
        const postWidth = 400;
        const postHeight = 160;

        return Array.from({ length: count }, (_, id) => {
            const rand = Math.floor(Math.random() * names.length);
            const centerX = Math.random() * containerWidth;
            const centerY = Math.random() * containerHeight;

            return {
                id,
                avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
                name: names[rand],
                handle: handles[rand],
                date: `${Math.floor(Math.random() * 28) + 1} ${['Jan', 'Feb', 'Mar', 'Apr', 'May'][Math.floor(Math.random() * 5)]}`,
                content: lorem[Math.floor(Math.random() * lorem.length)],
                replies: Math.floor(Math.random() * 50000),
                reposts: Math.floor(Math.random() * 100000),
                likes: Math.floor(Math.random() * 1000000),
                rotation: Math.floor(Math.random() * 181) - 90,
                top: centerY - postHeight / 2,
                left: centerX - postWidth / 2
            };
        });
    };

    const posts = generatePosts();

    const BlueCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="rgb(29, 155, 240)"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>
    const isDarkMode = false;
    return (
        <div className="relative w-[800px] h-[800px] overflow-hidden">
            {posts.map(post => (
                <div
                    key={post.id}
                    className="absolute w-[400px] bg-black rounded-xl border border-gray-900 p-4"
                    style={{
                        top: post.top,
                        left: post.left,

                    }}
                >
                    <div className="flex items-start space-x-3">
                        <img
                            src={post.avatar}
                            alt=""
                            className="w-[40px] h-[40px] rounded-full bg-gray-800"
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-1">
                                <span className="font-bold text-gray-300">{post.name}</span>
                                <span className="text-gray-200">{post.handle}</span>
                                <BlueCheck />
                                <span className="text-gray-200">·</span>
                                <span className="text-gray-200">{post.date}</span>
                            </div>
                            <p className="text-gray-300 mt-1">{post.content}</p>
                            <div className="mt-4 flex justify-between text-gray-200 text-sm">
                                <a className="hover:text-blue-500 flex items-center space-x-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="gray">
                                        <path d="M1.751 10c0-4.42 3.584-8..."></path>
                                    </svg>
                                    <span>{formatMetric(post.replies)}</span>
                                </a>
                                <a className="hover:text-green-500 flex items-center space-x-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="gray">
                                        <path d="M4.5 3.88l4.432 4.14..."></path>
                                    </svg>
                                    <span>{formatMetric(post.reposts)}</span>
                                </a>
                                <a className="hover:text-red-500 flex items-center space-x-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="gray">
                                        <path d="M16.697 5.5c-1.222-.06..."></path>
                                    </svg>
                                    <span>{formatMetric(post.likes)}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Paper;
