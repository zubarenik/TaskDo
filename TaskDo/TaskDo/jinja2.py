from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import reverse
import jinja2


def environment(**options):
    env = jinja2.Environment(**options)
    env.globals.update({"static": staticfiles_storage.url,
                        "url": reverse,
                        })
    return env
