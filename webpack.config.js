const path = require("path")

module.exports = {
    
    externals: {
        "react-native": true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [],
            },
            // ...
        ],
    },
  
};
