systems({
  "cloudtunes-server": {
    depends: ["mongo", "redis", "cloudtunes-webapp"],
    image: {"docker": "azukiapp/python:2.7.9"},
    provision: [
      "cd /azk/#{system.name}/cloudtunes-server/ && pip install --user --allow-all-external -r requirements.txt",
      "cp /azk/#{system.name}/cloudtunes-server/cloudtunes/settings/local.example.py"
      + " /azk/#{system.name}/cloudtunes-server/cloudtunes/settings/local.py",
    ],
    workdir: "/azk/#{system.name}",
    shell: "/bin/bash",
    mounts  : {
      "/azk/#{system.name}": path("."),
      "/azk/pythonuserbase":  persistent("pythonuserbase"),
    },
    scalable: {"default": 1},

    command: [
      "cd cloudtunes-server",
      "pip install -e .",
      "cloudtunes-server"
    ].join(";"),

    wait: {"retry": 20, "timeout": 1000},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "8001/tcp",
      flash: "10843/tcp",
    },
    envs: {
      // set instances variables
      PATH : "/azk/pythonuserbase/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      PYTHON_ENV : "production",
      PYTHONUSERBASE: "/azk/pythonuserbase",
      //
      // edit this ENVS on .env
      // $ cp .env.example .env
      //
    }
  },

  "cloudtunes-server-worker": {
    extends: "cloudtunes-server",
    command: [
      "cd cloudtunes-server",
      "pip install -e .",
      "cloudtunes-worker worker --loglevel=INFO -c 4"
    ].join(";"),

    wait: undefined,
    http: null,
    ports: null,
  },

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
    wait: undefined,
    mounts: {
      "/azk/#{system.name}": path("./cloudtunes-webapp"),

      // node
      "/azk/#{system.name}/node_modules": persistent("./node_modules"),
      "/azk/#{system.name}/.sass-cache": persistent("./.sass-cache"),
      "/azk/#{system.name}/build": persistent("./build"),

      // ruby
      "/azk/bundler": persistent("#{system.name}/bundler"),
      "/azk/#{system.name}/tmp": persistent("#{system.name}/tmp"),
      "/azk/#{system.name}/log": path("#{system.name}/log"),
      "/azk/#{system.name}/.bundle": path("#{system.name}/.bundle")
    },
    scalable: {"default": 1},
    http: null,
    ports: null,
    envs: {
      NODE_ENV: "production"
    },
  },

  redis: {
    image: { docker: "redis" },
    scalable: { default: 1, limit: 1 },
    http      : {
      domains: [ "#{system.name}.#{azk.default_domain}" ],
    },
    ports: {
      http: "6379:6379/tcp",
    },
    export_envs: {
      REDIS_URL: "redis://#{net.host}:#{net.port[6379]}"
    }
  },

  mongo: {
    image : { docker: "azukiapp/mongodb" },
    scalable: false,
    wait: { retry: 60, timeout: 1000 },
    // Mounts folders to assigned paths
    mounts: {
      // equivalent persistent_folders
      "/data/db": persistent("mongodb-#{manifest.dir}"),
    },
    ports: {
      http: "28017/tcp",
      data: "27017:27017/tcp",
    },
    http      : {
      domains: [ "#{system.name}.#{azk.default_domain}" ],
    },
    export_envs        : {
      MONGODB_URI: "mongodb://#{net.host}:#{net.port[27017]}/#{manifest.dir}_production",
      // LCB_DATABASE_URI: "mongodb://mongo/letschat",
      LCB_DATABASE_URI: "mongodb://#{net.host}:#{net.port[27017]}/#{manifest.dir}_production",
    },
  },

});
