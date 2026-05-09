use clap::Parser;
use std::path::Path;

mod commands;
mod parser;
mod validator;

use anyhow::Result;
use commands::{index, rss, sitemap, validate};

#[derive(Parser, Debug)]
#[command(name = "content-cli")]
#[command(about = "Blog content engine CLI", long_about = None)]
enum Commands {
    Validate {
        #[arg(value_name = "PATH")]
        path: String,
    },
    Index {
        #[arg(value_name = "PATH")]
        path: String,
        #[arg(long)]
        out: String,
    },
    Sitemap {
        #[arg(value_name = "PATH")]
        path: String,
        #[arg(long)]
        base_url: String,
        #[arg(long)]
        out: String,
    },
    Rss {
        #[arg(value_name = "PATH")]
        path: String,
        #[arg(long)]
        base_url: String,
        #[arg(long)]
        out: String,
        #[arg(long)]
        title: String,
        #[arg(long)]
        description: String,
    },
}

fn main() -> Result<()> {
    let cmd = Commands::parse();

    match cmd {
        Commands::Validate { path } => {
            validate::run(&path)?;
        }
        Commands::Index { path, out } => {
            index::run(&path, &out)?;
        }
        Commands::Sitemap {
            path,
            base_url,
            out,
        } => {
            sitemap::run(&path, &base_url, &out)?;
        }
        Commands::Rss {
            path,
            base_url,
            out,
            title,
            description,
        } => {
            rss::run(&path, &base_url, &out, &title, &description)?;
        }
    }

    Ok(())
}
