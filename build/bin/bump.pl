#!/usr/bin/perl
use strict;
use warnings;
use v5.10.0;
use utf8;
use open qw/:std :utf8/;

my $name = `node -p "require('./package.json').name"`;
chomp $name;

my $version = `npm pkg get version | sed 's/"//g'`;
chomp $version;
#say "package.json version $version";

exit if $version =~ /a$/;

my $online = `npm view $name version`;
chomp $online;
#say "NPM version $online";

system "npm version patch --no-git-tag-version --force" if $version eq $online;
