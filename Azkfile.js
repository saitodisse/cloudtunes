systems({
  "cloudtunes-webapp": {
    depends: [],
    image: {"docker": "azukiapp/ruby"},
    provision: [
      "npm install",
      "bundle install --path /azk/bundler",
      "node_modules/.bin/brunch build --env config-dist.coffee",
    ],
    workdir: "/azk/#{system.name}",
    shell: "/bin/bash",
    // command: "node_modules/.bin/brunch build --env config-dist.coffee",
    wait: 20,
    mounts: {
      '/azk/#{system.name}': sync("./cloudtunes-webapp"),

      // node
      '/azk/#{system.name}/node_modules': persistent("./node_modules"),
      '/azk/#{system.name}/.sass-cache': persistent("./.sass-cache"),
      '/azk/#{system.name}/build': persistent("./build"),

      // ruby
      "/azk/bundler": persistent("#{system.name}/bundler"),
      "/azk/#{system.name}/tmp": persistent("#{system.name}/tmp"),
      "/azk/#{system.name}/log": path("#{system.name}/log"),
      "/azk/#{system.name}/.bundle": path("#{system.name}/.bundle")
    },
    scalable: {"default": 1},
    http: {
      domains: [
        "#{system.name}.#{azk.default_domain}", // default azk
        "#{process.env.AZK_HOST_IP}"            // used if deployed
      ]
    },
    ports: {
      http: "8000/tcp"
    },
    envs: {
      NODE_ENV: "production",
      PORT: "8000",
    },
  },
});
